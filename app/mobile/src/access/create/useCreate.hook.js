import { useState, useEffect, useContext, useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';
import { getAvailable } from 'api/getAvailable';
import { getUsername } from 'api/getUsername';

export function useCreate() {

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

  const debounce = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

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

  const check = (server, token, username) => {
    if (debounce.current) {
      clearTimeout(debounce.current);
    }
    debounce.current = setTimeout(async () => {
      debounce.current = null;
      if (server) {
        try {
          const available = await getAvailable(server);
          if (available) {
            if (username) {
              try {
                const claimable = await getUsername(username, server, null);
                updateState({ usernameChecked: true, tokenChecked: true, serverChecked: true, tokenRequired: false,
                    usernameValid: claimable, serverValid: true });
              }
              catch (err) {
                updateState({ usernameChecked: true, tokenChecked: true, serverChecked: true, tokenRequired: false,
                    usernameValid: false, serverValid: true });
              }
            }
            else {
              updateState({ usernameChecked: true, tokenChecked: true, serverChecked: true, tokenRequired: false,
                  serverValid: true });
            }
          }
          else {
            if (token) {
              try {
                const accessible = await getUsername(null, server, token);
                if (accessible) {
                  if (username) {
                    try {
                      const claimable = await getUsername(username, server, token);
                      updateState({ usernameChecked: true, tokenChecked: true, serverChecked: true, tokenRequired: true,
                          usernameValid: claimable, tokenValid: true, serverValid: true });
                    }
                    catch (err) {
                      updateState({ usernameChecked: true, tokenChecked: true, serverChecked: true, tokenRequired: true,
                          usernameValid: false, tokenValid: true, serverValid: true });
                    }
                  }
                  else {
                    updateState({ usernameChecked: true, tokenChecked: true, serverChecked: true, tokenRequired: true,
                        tokenValid: true, serverValid: true });
                  }
                }
                else {
                  updateState({ usernameChecked: true, tokenChecked: true, serverChecked: true, tokenRequired: true,
                      tokenValid: false, serverValid: true });
                }
              }
              catch (err) {
                updateState({ usernameChecked: true, tokenChecked: true, serverChecked: true, tokenRequired: true,
                    tokenValid: false, serverValid: true });
              }
            }
            else {
              updateState({ usernameChecked: true, tokenChecked: true, serverChecked: true, tokenRequired: true,
                  serverValid: true });
            }
          }
        }
        catch (err) {
          updateState({ usernameChecked: true, tokenChecked: true, serverChecked: true, serverValid: false });
        }
      }
    }, 1000);
  }

  const actions = {
    config: () => {
      navigate('/admin');
    },
    setServer: (server) => {
      updateState({ server, serverChecked: false });
      check(server, state.token, state.username);
    },
    setToken: (token) => {
      updateState({ token, tokenChecked: false });
      check(state.server, token, state.username);
    },
    setUsername: (username) => {
      updateState({ username, usernameChecked: false });
      check(state.server, state.token, username);
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

