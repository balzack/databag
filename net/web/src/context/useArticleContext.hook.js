import { useEffect, useState } from 'react';

export function useArticleContext() {
  const [state, setState] = useState({
    token: null,
    revision: 0,
  });

  useEffect(() => {
  }, []);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const actions = {
    setToken: (token) => {
      updateState({ token });
    },
    clearToken: () => {
      setState({ init: false });
    },
    setRevision: async (revision) => {
      updateState({ revision });
    },
  }

  return { state, actions }
}


