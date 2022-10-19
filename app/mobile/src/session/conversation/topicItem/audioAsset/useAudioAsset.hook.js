import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { Image } from 'react-native';
import { useWindowDimensions } from 'react-native';

export function useAudioAsset(topicId, asset) {

  const [state, setState] = useState({
    width: 1,
    height: 1,
    url: null,
    playing: false,
    loaded: false,
  });

  const closing = useRef(null);
  const conversation = useContext(ConversationContext);
  const dimensions = useWindowDimensions();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const frameRatio = dimensions.width / dimensions.height;
    if (frameRatio > 1) {
      //height constrained
      const height = 0.9 * dimensions.height;
      const width = height;
      updateState({ width, height }); 
    }
    else {
      //width constrained
      const width = 0.9 * dimensions.width;
      const height = width;
      updateState({ width, height });
    }
  }, [dimensions]);

  useEffect(() => {
    const url = conversation.actions.getTopicAssetUrl(topicId, asset.full); 
    updateState({ url });
  }, [topicId, conversation, asset]);

  const actions = {
    play: () => {
      updateState({ playing: true });
    },
    pause: () => {
      updateState({ playing: false });
    },
    loaded: () => {
      updateState({ loaded: true });
    }
  };

  return { state, actions };
}

