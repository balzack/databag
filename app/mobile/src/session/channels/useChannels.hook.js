import { useState } from 'react';

export function useChannels() {
  const [state, setState] = useState({
    filter: null,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setFilter: () => {
    },
  };

  return { state, actions };
}

