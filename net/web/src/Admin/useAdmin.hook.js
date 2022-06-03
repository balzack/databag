import { useContext, useState, useEffect } from 'react';
import { getNodeStatus } from 'api/getNodeStatus';
import { setNodeStatus } from 'api/setNodeStatus';
import { getNodeConfig } from 'api/getNodeConfig';

export function useAdmin() {
  
  const [state, setState] = useState({
    unclaimed: null,
    access: null,
    token: null,
    busy: false,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const checkStatus = async () => {
    try {
      let status = await getNodeStatus();
      updateState({ unclaimed: status });
    }
    catch(err) {
      console.log(err);
      window.alert(err);
    }
  }

  useEffect(() => {
    checkStatus();
  }, []); 
    

  const actions = {
    setToken: (value) => {
      updateState({ token: value });
    },
    setAccess: async () => {
      try {
        await setNodeStatus(state.token);
        updateState({ access: state.token, unclaimed: false });
      }
      catch(err) {
        console.log(err);
        window.alert(err);
      }
    },
    getAccess: async () => {
      try {
        let config = await getNodeConfig(state.token);
        updateState({ access: state.token, config });
      }
      catch(err) {
        console.log(err);
        window.alert(err);
      }
    },
  };

  return { state, actions };
}
