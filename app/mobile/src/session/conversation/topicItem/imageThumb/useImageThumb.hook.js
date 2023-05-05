import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { Image } from 'react-native';

export function useImageThumb() {

  const [state, setState] = useState({
    loaded: false,
    ratio: 1,
    url: null,
  });

  const conversation = useContext(ConversationContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    loaded: (e) => {
      const { width, height } = e.nativeEvent.source;
      updateState({ loaded: true, ratio: width / height });
    },
  };

  return { state, actions };
}

