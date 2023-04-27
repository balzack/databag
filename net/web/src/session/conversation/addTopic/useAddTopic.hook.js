import { useContext, useState, useRef, useEffect } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { encryptBlock, encryptTopicSubject } from 'context/sealUtil';
import Resizer from "react-image-file-resizer";

export function useAddTopic(contentKey) {
  
  const [state, setState] = useState({
    enableImage: null,
    enableAudio: null,
    enableVideo: null,
    assets: [],
    messageText: null,
    textColor: '#444444',
    textColorSet: false,
    textSize: 14,
    textSizeSet: false,
    busy: false,
  });

  const conversation = useContext(ConversationContext);
  const objects = useRef([]);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  };

  const addAsset = (value) => {
    setState((s) => {
      let assets = [...s.assets, value];
      return { ...s, assets };
    });
  }

  const updateAsset = (index, value) => {
    setState((s) => {
      s.assets[index] = { ...s.assets[index], ...value };
      return { ...s };
    });
  }

  const removeAsset = (index) => {
    setState((s) => {
      s.assets.splice(index, 1);
      let assets = [...s.assets];
      return { ...s, assets };
    });
  }

  const clearObjects = () => {
    objects.current.forEach(object => {
      URL.revokeObjectURL(object);
    });
    objects.current = [];
  }

  useEffect(() => {
    updateState({ assets: [] });
    return () => { clearObjects() };
  }, [contentKey]);

  useEffect(() => {
    const { enableImage, enableAudio, enableVideo } = conversation.state.channel?.data?.channelDetail || {};
    updateState({ enableImage, enableAudio, enableVideo });
  }, [conversation.state.channel?.data?.channelDetail]);

  const loadFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsArrayBuffer(file)
    })
  };

  const setUrl = async (file) => {
    const url = URL.createObjectURL(file);
    objects.current.push(url);
    if (contentKey) {
      const buffer = await loadFile(file)
      const getEncryptedBlock = (pos, len) => {
        if (pos + len > buffer.byteLen) {
          return null;
        }
        const block = btoa(String.fromCharCode.apply(null, buffer.slice(pos, len)));
        return encryptBlock(block, contentKey);
      }
      return { url, encrypted: true, size: buffer.byteLength, getEncryptedBlock };
    }
    else {
      return { url, encrypted: false };
    }
  }

  const actions = {
    addImage: async (image) => {
      const asset = await setUrl(image);
      asset.image = image;
      addAsset(asset);
    },
    addVideo: async (video) => {
      const asset = await setUrl(video);
      asset.video = video;
      asset.position = 0;
      addAsset(asset);
    },
    addAudio: async (audio) => {
      const asset = await setUrl(audio);
      asset.audio = audio;
      asset.label = '';
      addAsset(asset);
    },
    setLabel: (index, label) => {
      updateAsset(index, { label });
    },
    setPosition: (index, position) => {
      updateAsset(index, { position });
    },
    removeAsset: (idx) => {
      removeAsset(idx) 
    },
    setTextColor: (value) => {
      updateState({ textColorSet: true, textColor: value });
    },
    setMessageText: (value) => {
      updateState({ messageText: value });
    },
    setTextSize: (value) => {
      updateState({ textSizeSet: true, textSize: value });
    },
    addTopic: async () => {
      if (!state.busy) {
        try {
          updateState({ busy: true });
          const type = contentKey ? 'sealedtopic' : 'superbasictopic';
          const message = (assets) => {
            if (assets?.length) {
              return {
                assets,
                text: state.messageText,
                textColor: state.textColorSet ? state.textColor : null,
                textSize: state.textSizeSet ? state.textSize : null,
              }
            }
            else {
              return {
                text: state.messageText,
                textColor: state.textColorSet ? state.textColor : null,
                textSize: state.textSizeSet ? state.textSize : null,
              }
            }
          };
          await conversation.actions.addTopic(type, message, [ ...state.assets ]);
          updateState({ busy: false, messageText: null, textColor: '#444444', textColorSet: false,
              textSize: 12, textSizeSet: false, assets: [] });
          clearObjects();
        }
        catch(err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error("failed to post topic");
        }
      }
      else {
        throw new Error("operation in progress");
      }
    },
  };

  return { state, actions };
}

