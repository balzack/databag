import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { Image } from 'react-native';
import Colors from 'constants/Colors';

export function useAddTopic(cardId, channelId) {

  const [state, setState] = useState({
    message: null,
    assets: [],
    fontSize: false,
    fontColor: false,
    size: 'medium',
    color: Colors.text,
  });

  const assetId = useRef(0);
  const conversation = useContext(ConversationContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

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
      updateState({ size });
    },
    setFontColor: (color) => {
      updateState({ color });
    },
  };

  return { state, actions };
}

