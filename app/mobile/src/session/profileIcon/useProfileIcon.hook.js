import { useState, useEffect, useContext } from 'react';
import { AppContext } from 'context/AppContext';
import { useNavigate } from 'react-router-dom';

export function useProfileIcon() {

  const [state, setState] = useState({
    disconnected: false,
  });

  const navigate = useNavigate();
  const app = useContext(AppContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { status } = app.state
    updateState({ disconnected: status === 'disconnected' });
    if (app.state.loggedOut) {
      navigate("/");
    }
  }, [app]);

  const actions = {};

  return { state, actions };
}
