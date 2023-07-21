import { useState, useRef, useEffect, useContext } from 'react';
import { UploadContext } from 'context/UploadContext';
import { ConversationContext } from 'context/ConversationContext';
import { Image } from 'react-native';
import Colors from 'constants/Colors';
import { encryptBlock, decryptBlock, getChannelSeals, getContentKey, encryptTopicSubject } from 'context/sealUtil';
import { AccountContext } from 'context/AccountContext';
import RNFS from 'react-native-fs';
import ImageResizer from '@bam.tech/react-native-image-resizer';

export function useAddTopic(contentKey) {

  const [state, setState] = useState({
    message: null,
    assets: [],
    fontSize: false,
    fontColor: false,
    size: 'medium',
    sizeSet: false,
    color: Colors.text,
    colorSet: false,
    busy: false,
    textSize: 14,
    enableImage: false,
    enableAudio: false,
    enableVideo: false,
    locked: true,
    loaded: false,
    conflict: false,
  });

  const SCALE_SIZE = (128 * 1024 * 1024);
  const assetId = useRef(0);
  const conversation = useContext(ConversationContext);
  const account = useContext(AccountContext);
  const upload = useContext(UploadContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    let conflict = false;
    state.assets.forEach(asset => {
      if (asset.type === 'image' && !state.enableImage) {
        conflict = true;
      }
      if (asset.video === 'video' && !state.enableVideo) {
        conflict = true;
      }
      if (asset.audio === 'audio' && !state.enableAudio) {
        conflict = true;
      }
    });
    updateState({ conflict });
  }, [state.assets, state.locked, state.enableImage, state.enableAudio, state.enableVideo]);

  useEffect(() => {
    updateState({ assets: [] });
  }, [contentKey]);

  useEffect(() => {
    const cardId = conversation.state.card?.card?.cardId;
    const channelId = conversation.state.channel?.channelId;
    const key = cardId ? `${cardId}:${channelId}` : `:${channelId}`

    const progress = upload.state.progress.get(key);
    if (progress) {
      let count = 0;
      let complete = 0;
      let active = 0;
      let loaded = 0;
      let total = 0;
      let error = false;
      progress.forEach(post => {
        count += post.count;
        complete += (post.index - 1);
        if (post.active) {
          active += 1;
          loaded += post.active.loaded;
          total += post.active.total;
        }
        if (post.error) {
          error = true;
        }
      });
      percent = Math.floor(((((loaded / total) * active) + complete) / count) * 100);
      updateState({ progress: percent, uploadError: error });

      if (error) {
        setTimeout(() => {
          upload.actions.clearErrors(cardId, channelId);
          updateState({ progress: null, uploadError: false });
        }, 2000);
      }
    }
    else {
      updateState({ progress: null });
    }
  }, [upload.state, conversation.state]);

  useEffect(() => {
    const { enableVideo, enableAudio, enableImage } = conversation.state.channel?.detail || {};
    const locked = conversation.state.channel?.detail?.dataType === 'superbasic' ? false : true;
    const loaded = conversation.state.loaded;
    updateState({ enableImage, enableAudio, enableVideo, locked, loaded });
  }, [conversation.state]);

  const setAsset = async (file, scale) => {
    const url = file.startsWith('file:') ? file : `file://${file}`;

    if (contentKey) {
      const orig = await RNFS.stat(url);
      const scaled = (scale && orig.size > SCALE_SIZE) ? await scale(url) : url;
      const stat = await RNFS.stat(scaled);
      const getEncryptedBlock = async (pos, len) => {
        if (pos + len > stat.size) {
          return null;
        }
        const block = await RNFS.read(scaled, len, pos, 'base64');
        return encryptBlock(block, contentKey);
      }
      return { data: url, encrypted: true, size: stat.size, getEncryptedBlock };
    }
    else {
      return { data: url, encrypted: false };
    }
  }

  const actions = {
    setMessage: (message) => {
      updateState({ message });
    },
    addImage: async (data, mime) => {
      assetId.current++;
      const asset = await setAsset(data, async (file) => {
        const scaled = await ImageResizer.createResizedImage(file, 512, 512, "JPEG", 90, 0, null);
        return `file://${scaled.path}`;
      });
      asset.key = assetId.current;
      asset.type = 'image';
      asset.mime = mime;
      asset.ratio = 1;
      updateState({ assets: [ ...state.assets, asset ] });
    },
    addVideo: async (data) => {
      assetId.current++;
      const asset = await setAsset(data);
      asset.key = assetId.current;
      asset.type = 'video';
      asset.position = 0;
      asset.ratio = 1;
      updateState({ assets: [ ...state.assets, asset ] });
    },
    addAudio: async (data, label) => {
      assetId.current++;
      const asset = await setAsset(data);
      asset.key = assetId.current;
      asset.type = 'audio';
      asset.label = label;
      updateState({ assets: [ ...state.assets, asset ] });
    }, 
    setVideoPosition: (key, position) => {
      updateState({ assets: state.assets.map((item) => {
          if(item.key === key) {
            return { ...item, position };
          }
          return item;
        })
      });
    },
    setAudioLabel: (key, label) => {
      updateState({ assets: state.assets.map((item) => {
          if(item.key === key) {
            return { ...item, label };
          }
          return item;
        })
      });
    },
    removeAsset: (key) => {
      updateState({ assets: state.assets.filter(item => (item.key !== key))});
    },
    showFontColor: () => {
      updateState({ fontColor: true });
    },
    hideFontColor: () => {
      updateState({ fontColor: false });
    },
    showFontSize: () => {
      updateState({ fontSize: true });
    },
    hideFontSize: () => {
      updateState({ fontSize: false });
    },
    setFontSize: (size) => {
      let textSize;
      if (size === 'large') {
        textSize = 18;
      }
      else if (size === 'small') {
        textSize = 10;
      }
      else {
        textSize = 14;
      }
      updateState({ size, sizeSet: true, textSize });
    },
    setFontColor: (color) => {
      updateState({ color, colorSet: true });
    },
    addTopic: async () => {
      if (!state.busy && (!state.locked || contentKey)) {
        try {
          updateState({ busy: true });
         
          const assemble = (assets) => {
            if (!state.locked) {
              return {
                assets: assets?.length ? assets : null,
                text: state.message,
                textColor: state.colorSet ? state.color : null,
                textSize: state.sizeSet ? state.size : null,
              }
            }
            else {
              const message = {
                assets: assets?.length ? assets : null,
                text: state.message,
                textColor: state.textColorSet ? state.textColor : null,
                textSize: state.textSizeSet ? state.textSize : null,
              }
              return encryptTopicSubject({ message }, contentKey);
            }
          };
          const type = state.locked ? "sealedtopic" : "superbasictopic";
          await conversation.actions.addTopic(type, assemble, state.assets);
          updateState({ busy: false, assets: [], message: null,
            size: 'medium', sizeSet: false, textSize: 14,
            color: Colors.text, colorSet: false,
          });
        }
        catch(err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error("failed to add message");
        }
      }
    },
  };

  return { state, actions };
}

