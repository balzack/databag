import { useContext, useState, useEffect } from 'react';
import { AppContext } from 'context/AppContext';
import { useNavigate, useLocation, useParams } from "react-router-dom";

export function useLogin() {
  
  const [state, setState] = useState({
    username: '',
    password: '',
    available: false,
    spinning: false,
  });

  const navigate = useNavigate();
  const { search } = useLocation();
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
    onAccess: async (token) => {
      actions.updateState({ spinning: true })
      try {
        await app.actions.access(token)
      }
      catch (err) {
        window.alert(err);
      }
      actions.updateState({ spinning: false })
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
        else {
          let params = new URLSearchParams(search);
          let token = params.get("access");
          if (token) {
            actions.onAccess(token);
          }
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
