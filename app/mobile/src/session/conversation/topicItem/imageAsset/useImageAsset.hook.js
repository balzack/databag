import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { Image } from 'react-native';
import { useWindowDimensions } from 'react-native';

export function useImageAsset(asset) {

  const [state, setState] = useState({
    frameWidth: 1,
    frameHeight: 1,
    imageRatio: 1,
    imageWidth: 1024,
    imageHeight: 1024,
    url: null,
    loaded: false,
    failed: false,
    controls: false,
  });

  const conversation = useContext(ConversationContext);
  const dimensions = useWindowDimensions();
  const controls = useRef();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (state.loaded) {
      const frameRatio = state.frameWidth / state.frameHeight;
      if (frameRatio > state.imageRatio) {
        //height constrained
        const height = Math.floor(0.9 * state.frameHeight);
        const width = Math.floor(height * state.imageRatio);

        updateState({ imageWidth: width, imageHeight: height }); 
      }
      else {
        //width constrained
        const width = Math.floor(0.9 * state.frameWidth);
        const height = Math.floor(width / state.imageRatio);
        updateState({ imageWidth: width, imageHeight: height });
      }
    }
    actions.showControls();
  }, [state.frameWidth, state.frameHeight, state.imageRatio, state.loaded]);

  useEffect(() => {
    imageWidth = dimensions.width * 0.9 > state.imageWidth ? state.imageWidth : dimensions.width * 0.9;
    imageHeight = dimensions.height * 0.9 > state.imageHeight ? state.imageHeight : dimensions.height * 0.9;
    updateState({ frameWidth: dimensions.width, frameHeight: dimensions.height, imageWidth, imageHeight });
  }, [dimensions]);

  useEffect(() => {
    if (asset.encrypted) {
      const now = Date.now();
      const url = asset.decrypted ? `file://${asset.decrypted}?now=${now}` : null
      updateState({ url, failed: asset.error });
    }
    else {
      updateState({ url: asset.full, failed: false });
    }
  }, [asset]);

  const actions = {
    setRatio: (e) => {
      const { width, height } = e.nativeEvent;
      updateState({ imageRatio: width / height });
    },
    loaded: () => {
      updateState({ loaded: true });
    },
    failed: (e) => {
console.log("FAILEE!!!", e);
      updateState({ failed: true });
    },
    showControls: () => {
      clearTimeout(controls.current);
      updateState({ controls: true });
      controls.current = setTimeout(() => {
        updateState({ controls: false });
      }, 2000);
    },
  };

  return { state, actions };
}

