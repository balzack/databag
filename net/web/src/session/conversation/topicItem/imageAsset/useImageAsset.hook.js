import { useState } from 'react';

export function useImageAsset() {

  const [state, setState] = useState({
    popout: false,
    width: 0,
    height: 0,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setPopout: (width, height) => {
      updateState({ popout: true, width, height });
    },
    clearPopout: () => {
      updateState({ popout: false });
    },
  };

  return { state, actions };
}
