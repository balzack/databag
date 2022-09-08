import { useState, useEffect, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';

export function useLogin() {

  const navigate = useNavigate();
  const app = useContext(AppContext);

  const [state, setState] = useState({
    busy: false,
    enabled: false,
    login: null,
    password: null,
    showPassword: false,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (state.password && state.login && !state.enabled) {
      updateState({ enabled: true });
    }
    if ((!state.password || !state.login) && state.enabled) {
      updateState({ enabled: false });
    }
  }, [state.login, state.password]);

  const actions = {
    config: () => {
      navigate('/admin');
    },
    setLogin: (login) => {
      updateState({ login });
    },
    setPassword: (password) => {
      updateState({ password });
    },
    create: () => {
      navigate('/create');
    },
    showPassword: () => {
      updateState({ showPassword: true });
    },
    hidePassword: () => {
      updateState({ showPassword: false });
    },
    login: async () => {
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

