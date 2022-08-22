import { useContext, useState } from 'react';

export function useAddTopic() {
  
  const [state, setState] = useState({});

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  };

  const actions = {
  };

  return { state, actions };
}

