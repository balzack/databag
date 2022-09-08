import { useState, useEffect, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';

export function useCreate() {

  const navigate = useNavigate();
  const app = useContext(AppContext);

  const [state, setState] = useState({
    busy: false,
    enabled: false,
    login: null,
    password: null,
    confirm: null,
    showPassword: false,
    showConfirm: false,
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
    setConfirm: (confirm) => {
      updateState({ confirm });
    },
    login: () => {
      navigate('/login');
    },
    showPassword: () => {
      updateState({ showPassword: true });
    },
    hidePassword: () => {
      updateState({ showPassword: false });
    },
    showConfirm: () => {
      updateState({ showConfirm: true });
    },
    hideConfirm: () => {
      updateState({ showConfirm: false });
    },
    create: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          await app.actions.create(state.login, state.password);
          navigate('/');
        }
        catch (err) {
          console.log(err);
          updateState({ busy: false, showAlert: true });
          throw new Error('create failed');
        }
        updateState({ busy: false });
      }
    }
  };

  return { state, actions };
}

