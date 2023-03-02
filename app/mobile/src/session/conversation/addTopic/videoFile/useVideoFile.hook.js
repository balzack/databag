import { useState, useRef, useEffect, useContext } from 'react';

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
        const step = Math.floor(1 + state.duration / 20);
        const position = (state.position + step ) % state.duration;
        updateState({ position });
      }
    },
  };

  return { state, actions };
}
