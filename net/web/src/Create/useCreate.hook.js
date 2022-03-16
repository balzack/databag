import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../AppContext/AppContext';
import { useNavigate } from "react-router-dom";

export function useCreate() {
  const [checked, setChecked] = useState(true)
  const [state, setState] = useState({
    username: '',
    password: '',
    confirmed: '',
    conflict: '',
    spinning: false,
  });

  const navigate = useNavigate();
  const app = useContext(AppContext);
  const debounce = useRef(null)

  const actions = {
    setUsername: (username) => {
      actions.updateState({ username });
      usernameSet(username)
    },
    setPassword: (password) => {
      actions.updateState({ password });
    },
    setConfirmed: (confirmed) => {
      actions.updateState({ confirmed });
    },
    isDisabled: () => {
      if (state.username !== '' && state.password !== '' && state.password === state.confirmed && 
          checked && state.conflict === '') {
        return false
      }
      return true
    },
    onLogin: async () => {
      navigate('/login')
    },
    onCreate: async () => {
      if (!state.spinning) {
        actions.updateState({ spinning: true })
        try {
          await app.actions.create(state.username, state.password)
        }
        catch (err) {
          window.alert(err);
        }
        actions.updateState({ spinning: false })
      }
    },
    updateState: (value) => {
      setState((s) => ({ ...s, ...value }));
    },
  };

  const usernameSet = (name) => {
    setChecked(false)
    clearTimeout(debounce.current)
    debounce.current = setTimeout(async () => {
      if (app.actions && app.actions.username) {
        if (name === '') {
          setChecked(true)
          actions.updateState({ conflict: '' })
        }
        else {
          let valid = await app.actions.username(name)
          setChecked(true)
          if (!valid) {
            actions.updateState({ conflict: 'not available' })
          } else {
            actions.updateState({ conflict: '' })
          }
        }
      }
    }, 500)
  }

  useEffect(() => {
    if (app) {
      if (app.state) {
        if (app.state.access === 'user') {
          navigate('/user')
        }
        if (app.state.access === 'admin') {
          navigate('/admin')
        }
      }
    }
  }, [app])

  return { state, actions };
}
