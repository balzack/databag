import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';

export function useVideoFile() {

  const [state, setState] = useState({
    duration: 0,
    position: 0,
    ratio: 1,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setInfo: (width, height, duration) => {
      updateState({ ratio: width / height, duration: Math.floor(duration) });
    },
    setNextPosition: () => {
      if (state.duration) {
        const position = (state.position + 1) % state.duration;
        updateState({ position });
      }
    },
  };

  return { state, actions };
}

