import { useState, useEffect, useContext, useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';
import { getAvailable } from 'api/getAvailable';
import { getUsername } from 'api/getUsername';

export function useCreate() {

  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const app = useContext(AppContext);

  const [state, setState] = useState({
    busy: false,
    enabled: false,
    server: null,
    token: null,
    username: null,
    password: null,
    confirm: null,
    showPassword: false,
    showConfirm: false,
    serverChecked: true,
    serverValid: false,
    tokenRequired: false,
    tokenChecked: true,
    tokenValid: false,
    usernameChecked: true,
    usernameValid: false,
  });

  const backoff = useRef(false);
  const checking = useRef(false);
  const debounce = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (app.state.session) {
      navigate('/session');
    }
  }, [app.state.session]);

  useEffect(() => {
    if (state.usernameChecked && state.serverChecked && state.tokenChecked &&
        state.password && state.username && state.server && state.confirm &&
        (!state.tokenRequired || state.tokenValid) &&
        state.serverValid && state.usernameValid && state.password === state.confirm) {
      if (!state.enabled) {
        updateState({ enabled: true });
      }
    }
    else {
      if (state.enabled) {
        updateState({ enabled: false });
      }
    }
  }, [state]);

  useEffect(() => {
    if (checking.current) {
      backoff.current = true;
    }
    if (debounce.current) {
      clearTimeout(debounce.current);
    }
    debounce.current = setTimeout(async () => {
      checking.current = true;
      debounce.current = null;
      if (state.server) {
        try {
          const available = await getAvailable(state.server);
          if (available) {
            if (state.username) {
              try {
                const claimable = await getUsername(state.username, state.server, null);
                updateState({ tokenRequired: false, usernameValid: claimable, serverValid: true });
              }
              catch (err) {
                updateState({ tokenRequired: false, usernameValid: false, serverValid: true });
              }
            }
            else {
              updateState({ tokenRequired: false, serverValid: true });
            }
          }
          else {
            if (state.token) {
              try {
                const accessible = await getUsername(null, state.server, state.token);
                if (accessible) {
                  if (state.username) {
                    try {
                      const claimable = await getUsername(state.username, state.server, state.token);
                      updateState({ tokenRequired: true, usernameValid: claimable, tokenValid: true, serverValid: true });
                    }
                    catch (err) {
                      updateState({ tokenRequired: true, usernameValid: false, tokenValid: true, serverValid: true });
                    }
                  }
                  else {
                    updateState({ tokenRequired: true, tokenValid: true, serverValid: true });
                  }
                }
                else {
                  updateState({ tokenRequired: true, tokenValid: false, serverValid: true });
                }
              }
              catch (err) {
                updateState({ tokenRequired: true, tokenValid: false, serverValid: true });
              }
            }
            else {
              updateState({ tokenRequired: true, serverValid: true });
            }
          }
        }
        catch (err) {
          updateState({ serverValid: false });
        }
      }
      let retry = backoff.current; 
      backoff.current = false;
      checking.current = false;
      if (retry) {
        setCount(count++);
      }
      else {
        updateState({ usernameChecked: true, tokenChecked: true, serverChecked: true });
      }
    }, 1000);
  }, [count]);

  const actions = {
    config: () => {
      navigate('/admin');
    },
    setServer: (server) => {
      updateState({ server, serverChecked: false });
      setCount(count+1);
    },
    setToken: (token) => {
      updateState({ token, tokenChecked: false });
      setCount(count+1);
    },
    setUsername: (username) => {
      updateState({ username, usernameChecked: false });
      setCount(count+1);
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

