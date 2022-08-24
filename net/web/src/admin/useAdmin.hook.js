import { useContext, useState, useEffect } from 'react';
import { ViewportContext } from 'context/ViewportContext';

export function useAdmin() {

  const [state, setState] = useState({
    display: null,
  });

  const viewport = useContext(ViewportContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  const actions = {
    login: (token, config) => {
      updateState({ token, config });
    },
    logout: () => {
      updateState({ token: null, config: null });
    },
  };

  return { state, actions };
}

