import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { Image } from 'react-native';
import Colors from 'constants/Colors';

export function useAddTopic(sealed, sealKey) {

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
  });

  const assetId = useRef(0);
  const conversation = useContext(ConversationContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { enableVideo, enableAudio, enableImage } = conversation.state.channel?.detail || {};
    updateState({ enableImage, enableAudio, enableVideo });
  }, [conversation.state]);

  const actions = {
    setMessage: (message) => {
      updateState({ message });
    },
    addImage: (data) => {
      assetId.current++;
      Image.getSize(data, (width, height) => {
        const asset = { key: assetId.current, type: 'image', data: data, ratio: width/height };
        updateState({ assets: [ ...state.assets, asset ] });
      });
    },
    addVideo: (data) => {
      assetId.current++;
      const asset = { key: assetId.current, type: 'video', data: data, ratio: 1, duration: 0, position: 0 };
      updateState({ assets: [ ...state.assets, asset ] });
    },
    addAudio: (data, label) => {
      assetId.current++;
      const asset = { key: assetId.current, type: 'audio', data: data, label };
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
      if (!state.busy) {
        try {
          updateState({ busy: true });
          let message = {
            text: state.message,
            textColor: state.colorSet ? state.color : null,
            textSize: state.sizeSet ? state.size : null,
          };
          if (sealed) {
            await conversation.actions.addSealedTopic(message, sealKey);
          }
          else {
            await conversation.actions.addTopic(message, state.assets);
          }
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

