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
    const { status } = app.state
    updateState({ disconnected: status === 'disconnected' });
  }, [app]);

  const actions = {};

  return { state, actions };
}
