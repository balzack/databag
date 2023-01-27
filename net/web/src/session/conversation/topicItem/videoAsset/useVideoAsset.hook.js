import { useState } from 'react';

export function useVideoAsset() {

  const [state, setState] = useState({
    width: 0,
    height: 0,
    active: false,
    dimension: { width: 0, height: 0 },
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
    setDimension: (dimension) => {
      updateState({ dimension });
    },
  };

  return { state, actions };
}

