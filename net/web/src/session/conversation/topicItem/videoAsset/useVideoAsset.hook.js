import { useState } from 'react';

export function useVideoAsset() {

  const [state, setState] = useState({
    width: 0,
    height: 0,
    active: false,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setActive: (width, height, url) => {
      updateState({ active: true, width, height });
    },
    clearActive: () => {
      updateState({ active: false });
    },
  };

  return { state, actions };
}

