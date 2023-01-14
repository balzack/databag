import { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getNodeStatus } from 'api/getNodeStatus';
import { setNodeStatus } from 'api/setNodeStatus';
import { getNodeConfig } from 'api/getNodeConfig';
import { AppContext } from 'context/AppContext';

export function useAdmin() {

  const [state, setState] = useState({
    password: '',
    placeholder: '',
    unclaimed: null,
    busy: false,
  });

  const navigate = useNavigate();
  const app = useContext(AppContext);

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

  useEffect(() => {
    if (app.state.adminToken) {
      navigate('/dashboard'); 
    }
  }, [app.state]);

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
console.log("CHECK1");
          await getNodeConfig(state.password);
console.log("CHECK2");
          updateState({ busy: false });
console.log("CHECK3");
console.log(app);
          app.actions.setAdmin(state.password);          
console.log("DONE!");
        }
        catch(err) {
console.log("ERROR!");
          console.log(err);
          updateState({ busy: false });
          throw new Error("login failed");
        }
      }
    },
  }

  return { state, actions };
}

