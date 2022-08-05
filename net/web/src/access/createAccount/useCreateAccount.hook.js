import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from 'context/AppContext';
import { useNavigate, useLocation } from "react-router-dom";

export function useCreateAccount() {

  const [checked, setChecked] = useState(true);
  const [state, setState] = useState({
    username: '',
    password: '',
    confirm: '',
    busy: false,
    validatetatus: 'success',
    help: '',
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const app = useContext(AppContext);
  const debounce = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const usernameSet = (name) => {
    setChecked(false)
    clearTimeout(debounce.current)
    debounce.current = setTimeout(async () => {
      if (app.actions?.username && name !== '') {
        try {
          let valid = await app.actions.username(name, state.token)
          if (!valid) {
            updateState({ validateStatus: 'error', help: 'Username is not available' })
          }
          else {
            updateState({ validateStatus: 'success', help: '' })
          }
          setChecked(true)
        }
        catch(err) {
          console.log(err);
        }
      }
      else {
        updateState({ validateStatus: 'success', help: '' });
        setChecked(true);
      }
    }, 500)
  }

  const actions = {
    setUsername: (username) => {
      updateState({ username });
      usernameSet(username);
    },
    setPassword: (password) => {
      updateState({ password });
    },
    setConfirm: (confirm) => {
      updateState({ confirm });
    },
    isDisabled: () => {
      if (state.username === '' || state.password === '' || state.password !== state.confirm || !checked ||
          state.validateStatus === 'error') {
        return true
      }
      return false
    },
    onSettings: () => {
      navigate('/admin');
    },
    onCreateAccount: async () => {
      if (!state.busy && state.username !== '' && state.password !== '' && state.password === state.confirm) {
        updateState({ busy: true })
        try {
          await app.actions.create(state.username, state.password)
        }
        catch (err) {
          console.log(err);
          updateState({ busy: false })
          throw new Error('create failed: check with your admin');
        }
        updateState({ busy: false })
      }
    },
    onLogin: () => {
      navigate('/login');
    },
  };

  useEffect(() => {
    if (app) {
      if (app.state) {
        if (app.state.access) {
          navigate('/session')
        }
      }
      else {
        let params = new URLSearchParams(search);
        let token = params.get("add");
        if (token) {
          updateState({ token });
        }
      }
    }
  }, [app, navigate, search])

  return { state, actions };
}

