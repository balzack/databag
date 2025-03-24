import { useState } from 'react';

export function useImageFile() {
  const [state, setState] = useState({
    loaded: false,
    ratio: 1,
  });


  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }));
  };

  const actions = {
    loaded: (e) => {
      const { width, height } = e.nativeEvent.source;
      updateState({ loaded: true, ratio: width / height });
    },
  };

  return { state, actions };
}
