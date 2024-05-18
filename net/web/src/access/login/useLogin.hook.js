import { useContext, useState, useEffect } from 'react';
import { AppContext } from 'context/AppContext';
import { SettingsContext } from 'context/SettingsContext';
import { getAvailable } from 'api/getAvailable';
import { useLocation, useNavigate } from "react-router-dom";

export function useLogin() {

  const [state, setState] = useState({
    username: '',
    password: '',
    available: false,
    availableSet: false,
    disabled: true,
    busy: false,
    strings: {},
    menuStyle: {},
    mfaModal: false,
    mfaCode: null,
    mfaError: null,
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const app = useContext(AppContext);
  const settings = useContext(SettingsContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setUsername: (username) => {
      updateState({ username });
    },
    setPassword: (password) => {
      updateState({ password });
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
      if (!state.busy && state.username !== '' && state.password !== '') {
        updateState({ busy: true })
        try {
          await app.actions.login(state.username, state.password, state.mfaCode)
        }
        catch (err) {
          const msg = err?.message;
          if (msg === '405' || msg === '403' || msg === '429') {
            updateState({ busy: false, mfaModal: true, mfaError: msg });
          }
          else {
            console.log(err);
            updateState({ busy: false })
            throw new Error('login failed: check your username and password');
          }
        }
        updateState({ busy: false })
      }
    },
    onCreate: () => {
      navigate('/create');
    },
    setCode: (mfaCode) => {
      updateState({ mfaCode });
    },
    dismissMFA: () => {
      updateState({ mfaModal: false, mfaCode: null });
    },
  };

  useEffect(() => {
    const count = async () => {
      try {
        const available = await getAvailable()
        updateState({ availableSet: true, available: available !== 0 })
      }
      catch(err) {
        console.log(err);
      }
    }
    count();
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const { strings, menuStyle } = settings.state;
    updateState({ strings, menuStyle });
  }, [settings.state]);

  const access =  async (token) => {
    if (!state.busy) {
      updateState({ busy: true });
      try {
        await app.actions.access(token);
      }
      catch (err) {
        console.log(err);
        updateState({ busy: false });
        throw new Error('access failed: check your token');
      }
      updateState({ busy: false });
    }
  }
 
  useEffect(() => {
    let params = new URLSearchParams(search);
    let token = params.get("access");
    if (token) {
      access(token);
    }
    // eslint-disable-next-line
  }, [])

  return { state, actions };
}

