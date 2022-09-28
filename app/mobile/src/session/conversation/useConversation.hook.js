import { useState, useEffect, useContext } from 'react';

export function useConversation() {

  const [state, setState] = useState({
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
  };

  return { state, actions };
}

