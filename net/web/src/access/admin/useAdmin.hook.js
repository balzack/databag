import { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getNodeStatus } from 'api/getNodeStatus';
import { setNodeStatus } from 'api/setNodeStatus';
import { getNodeConfig } from 'api/getNodeConfig';

export function useAdmin() {

  const [state, setState] = useState({
    password: '',
    placeholder: '',
    unclaimed: null,
    busy: false,
  });

  const navigate = useNavigate();

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
          const status = await getNodeConfig(state.password);
          const config = encodeURIComponent(JSON.stringify(config));
          const pass= encodeURIComponent(state.password);
          
          updateState({ busy: false });
          navigate(`/dashboard?config=${status}&pass=${pass}`); 
        }
        catch(err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error("login failed");
        }
      }
    },
  }

  return { state, actions };
}

