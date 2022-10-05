import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { Image } from 'react-native';

export function useImageAsset(topicId, asset) {

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
    if (url) {
      Image.getSize(url, (width, height) => {
        updateState({ url, ratio: width / height });
      });
    }
  }, [topicId, conversation, asset]);

  const actions = {
  };

  return { state, actions };
}

