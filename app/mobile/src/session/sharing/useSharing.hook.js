import { useState } from 'react';

export function useSharing() {
  const [state, setState] = useState({
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
  };

  return { state, actions };
}

