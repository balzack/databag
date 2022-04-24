import { useEffect, useState, useRef } from 'react';

export function useCardContext() {
  const [state, setState] = useState({
    token: null,
    revision: 0,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const actions = {
    setToken: async (token) => {
      updateState({ token });
    },
    setRevision: async (revision) => {
      updateState({ revision });
    },
  }

  return { state, actions }
}


