import { useState, useEffect, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';
import { getNodeStatus } from 'api/getNodeStatus';
import { setNodeStatus } from 'api/setNodeStatus';
import { getNodeConfig } from 'api/getNodeConfig';

export function useAdmin() {

  const navigate = useNavigate();
  const app = useContext(AppContext);

  const [state, setState] = useState({
    busy: false,
    enabled: false,
    server: null,
    token: null,
    plainText: false,
    version: null,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ version: app.state.version });
  }, [app]);

  const checkStatus = async () => {
    try {
      updateState({ unclaimed: status });
    }
    catch (err) {
      console.log("failed to check node status");
    }
  };

  useEffect(() => {
    if (state.token && state.server && !state.enabled) {
      updateState({ enabled: true });
    }
    if ((!state.token || !state.server) && state.enabled) {
      updateState({ enabled: false });
    }
  }, [state.server, state.token]);

  const actions = {
    setServer: (server) => {
      updateState({ server });
    },
    setToken: (token) => {
      updateState({ token });
    },
    login: () => {
      navigate('/login');
    },
    showPass: () => {
      updateState({ plainText: true });
    },
    hidePass: () => {
      updateState({ plainText: false });
    },
    access: async () => {
      if (!state.busy) {
        try {
          updateState({ busy: true });
          const unclaimed = await getNodeStatus(state.server);
          if (unclaimed) {
            await setNodeStatus(state.server, state.token);
          } 
          const config = await getNodeConfig(state.server, state.token);
          const { server, token } = state;
          updateState({ busy: false });
          navigate('/dashboard', { state: { config, server, token }});
        }
        catch (err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error("access failed");
        }
      }
    }
  };

  return { state, actions };
}

