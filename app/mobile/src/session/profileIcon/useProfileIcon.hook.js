import { useState, useEffect, useContext } from 'react';
import { AppContext } from 'context/AppContext';

export function useProfileIcon() {

  const [state, setState] = useState({
    disconnected: false,
  });

  const app = useContext(AppContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { disconnected } = app.state
    updateState({ disconnected });
  }, [app]);

  const actions = {};

  return { state, actions };
}

