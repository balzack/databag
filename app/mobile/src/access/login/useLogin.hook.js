import { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';

export function useLogin() {

  const navigate = useNavigate();

  const [state, setState] = useState({
    createable: false,
    enabled: false,
    login: null,
    password: null,
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
  };

  return { state, actions };
}

