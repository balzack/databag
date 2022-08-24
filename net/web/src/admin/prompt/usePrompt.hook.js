import { useContext, useState, useEffect } from 'react';
import { AppContext } from 'context/AppContext';
import { useNavigate, useLocation } from "react-router-dom";
import { getNodeStatus } from 'api/getNodeStatus';
import { setNodeStatus } from 'api/setNodeStatus';
import { getNodeConfig } from 'api/getNodeConfig';

export function usePrompt() {

  const [state, setState] = useState({
    password: null,
    placeholder: '',
    unclaimed: null,
    busy: false,
  });

  const navigate = useNavigate();
  const app = useContext(AppContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const checkStatus = async () => {
    try {
      let status = await getNodeStatus();
      updateState({ uncliamed: status });
    }
    catch(err) {
      console.log("failed to check node status");
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const actions = {
    setPassword: (password) => {
      updateState({ password });
    },
    onUser: () => {
      navigate('/login');
    },
    onLogin: async () => {
      if (!state.busy) {
        try {
          updateState({ busy: true });
          if (state.unclaimed === true) {
            await setNodeStatus(state.password);
            return await getNodeConfig(state.password);
          }
          else {
            return await getNodeConfig(state.password);
          }
          updateState({ busy: false });
        }
        catch (err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error("access denied");
        }
      }
      else {
        throw new Error("operation in progress");
      }
    },
  };

  useEffect(() => {
  }, [app, navigate])

  return { state, actions };
}

