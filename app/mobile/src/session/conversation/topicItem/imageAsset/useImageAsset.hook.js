import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { Image } from 'react-native';
import { useWindowDimensions } from 'react-native';

export function useImageAsset(topicId, asset) {

  const [state, setState] = useState({
    frameWidth: 1,
    frameHeight: 1,
    imageRatio: 1,
    imageWidth: 1,
    imageHeight: 1,
    url: null,
    loaded: false,
    failed: false,
  });

  const conversation = useContext(ConversationContext);
  const dimensions = useWindowDimensions();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (state.loaded) {
      const frameRatio = state.frameWidth / state.frameHeight;
      if (frameRatio > state.imageRatio) {
        //height constrained
        const height = 0.9 * state.frameHeight;
        const width = height * state.imageRatio;
        updateState({ imageWidth: width, imageHeight: height }); 
      }
      else {
        //width constrained
        const width = 0.9 * state.frameWidth;
        const height = width / state.imageRatio;
        updateState({ imageWidth: width, imageHeight: height });
      }
    }
  }, [state.frameWidth, state.frameHeight, state.imageRatio, state.loaded]);

  useEffect(() => {
    updateState({ frameWidth: dimensions.width, frameHeight: dimensions.height });
  }, [dimensions]);

  useEffect(() => {
    const url = conversation.actions.getTopicAssetUrl(topicId, asset.full); 
    updateState({ url });
  }, [topicId, conversation, asset]);

  const actions = {
    loaded: (e) => {
      const { width, height } = e.nativeEvent.source;
      updateState({ loaded: true, imageRatio: width / height });
    },
    failed: () => {
      updateState({ failed: true });
    },
  };

  return { state, actions };
}

