import { useState, useEffect, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';

export function useReset() {

  const navigate = useNavigate();
  const app = useContext(AppContext);

  const [state, setState] = useState({
    busy: false,
    enabled: false,
    server: null,
    token: null,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (app.state.session) {
      navigate('/session');
    }
  }, [app.state.session]);

  useEffect(() => {
    if (state.token && state.server && !state.enabled) {
      updateState({ enabled: true });
    }
    if ((!state.token || !state.server) && state.enabled) {
      updateState({ enabled: false });
    }
  }, [state.server, state.token]);

  const actions = {
    config: () => {
      navigate('/admin');
    },
    setServer: (server) => {
      updateState({ server });
    },
    setToken: (token) => {
      updateState({ token });
    },
    login: () => {
      navigate('/login');
    },
    access: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          await app.actions.login(state.login, state.password);
          navigate('/');
        }
        catch (err) {
          console.log(err);
          updateState({ busy: false, showAlert: true });
          throw new Error('login failed');
        }
        updateState({ busy: false });
      }
    }
  };

  return { state, actions };
}

