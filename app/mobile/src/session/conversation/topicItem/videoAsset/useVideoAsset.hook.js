import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { Image } from 'react-native';
import { useWindowDimensions } from 'react-native';

export function useVideoAsset(topicId, asset) {

  const [state, setState] = useState({
    frameWidth: 1,
    frameHeight: 1,
    videoRatio: 1,
    width: 1,
    weight: 1,
    url: null,
    controls: false,
  });

  const conversation = useContext(ConversationContext);
  const dimensions = useWindowDimensions();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const frameRatio = state.frameWidth / state.frameHeight;
    if (frameRatio > state.videoRatio) {
      //height constrained
      const height = 0.9 * state.frameHeight;
      const width = height * state.videoRatio;
      updateState({ width, height }); 
    }
    else {
      //width constrained
      const width = 0.9 * state.frameWidth;
      const height = width / state.videoRatio;
      updateState({ width, height });
    }
  }, [state.frameWidth, state.frameHeight, state.videoRatio]);

  useEffect(() => {
    updateState({ frameWidth: dimensions.width, frameHeight: dimensions.height });
  }, [dimensions]);

  useEffect(() => {
    const url = conversation.actions.getTopicAssetUrl(topicId, asset.hd); 
    updateState({ url });
  }, [topicId, conversation, asset]);

  const actions = {
    setResolution: (width, height) => {
      updateState({ controls: true, videoRatio: width / height });
    }
  };

  return { state, actions };
}

