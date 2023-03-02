import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { Image } from 'react-native';

export function useImageThumb(topicId, asset) {

  const [state, setState] = useState({
    ratio: 1,
    url: null,
  });

  const conversation = useContext(ConversationContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const url = conversation.actions.getTopicAssetUrl(topicId, asset.thumb); 
    updateState({ url });
  }, [topicId, conversation, asset]);

  const actions = {
    loaded: (e) => {
      const { width, height } = e.nativeEvent.source;
      updateState({ ratio: width / height });
    },
  };

  return { state, actions };
}

