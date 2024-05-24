import { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getNodeStatus } from 'api/getNodeStatus';
import { setNodeStatus } from 'api/setNodeStatus';
import { setNodeAccess } from 'api/setNodeAccess';
import { AppContext } from 'context/AppContext';
import { SettingsContext } from 'context/SettingsContext';

export function useAdmin() {

  const [state, setState] = useState({
    password: '',
    placeholder: '',
    unclaimed: null,
    busy: false,
    strings: {},
    menuStyle: {},
    mfaModal: false,
    mfaCode: null,
    mfaError: null,
  });

  const navigate = useNavigate();
  const app = useContext(AppContext);
  const settings = useContext(SettingsContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const check = async () => {
      try {
        const unclaimed = await getNodeStatus();
        updateState({ unclaimed });
      }
      catch(err) {
        console.log("getNodeStatus failed");
      }
    };
    check();
  }, []);

  const actions = {
    setPassword: (password) => {
      updateState({ password });
    },
    navUser: () => {
      navigate('/login');
    },
    login: async () => {
      if (!state.busy) {
        try {
          updateState({ busy: true });
          if (state.unclaimed === true) {
            await setNodeStatus(state.password);
          }
          try {
            const session = await setNodeAccess(state.password, state.mfaCode);
            app.actions.setAdmin(session);          
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
          updateState({ busy: false });
        }
        catch(err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error("login failed");
        }
      }
    },
    setCode: (mfaCode) => {
      updateState({ mfaCode });
    },
    dismissMFA: () => {
      updateState({ mfaModal: false, mfaCode: null });
    },
  }

  useEffect(() => {
    const { strings, menuStyle } = settings.state;
    updateState({ strings, menuStyle });
  }, [settings.state]);

  return { state, actions };
}

