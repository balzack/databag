import { useContext, useState, useEffect } from 'react';
import { AppContext } from 'context/AppContext';
import { useNavigate } from "react-router-dom";

export function useLogin() {
  
  const [state, setState] = useState({
    username: '',
    password: '',
    available: false,
    spinning: false,
  });

  const navigate = useNavigate();
  const app = useContext(AppContext);

  const actions = {
    setUsername: (username) => {
      actions.updateState({ username });
    },
    setPassword: (password) => {
      actions.updateState({ password });
    },
    isDisabled: () => {
      if (state.username === '' || state.password === '') {
        return true
      }
      return false
    },
    onSettings: () => {
      navigate('/admin');
    },
    onLogin: async () => {
      if (!state.spinning && state.username != '' && state.password != '') {
        actions.updateState({ spinning: true })
        try {
          await app.actions.login(state.username, state.password)
        }
        catch (err) {
          window.alert(err)
        }
        actions.updateState({ spinning: false })
      }
    },
    onCreate: () => {
      navigate('/create')
    },
    updateState: (value) => {
      setState((s) => ({ ...s, ...value }));
    },
  };

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
      if (app.actions && app.actions.available) {
        const count = async () => {
          const available = await app.actions.available()
          actions.updateState({ available: available !== 0 })
        }
        count();
      }
    }
  }, [app])

  return { state, actions };
}
