import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../AppContext/AppContext';
import { useNavigate } from "react-router-dom";

export function useUser() {
  
  const [state, setState] = useState({});

  const navigate = useNavigate();
  const app = useContext(AppContext);

  const actions = {
    updateState: (value) => {
      setState((s) => ({ ...s, ...value }));
    },
  };

  useEffect(() => {
    if (app) {
      if (app.state == null) {
          navigate('/')
      }
      else if (app.state.access === 'admin') {
        navigate('/admin')
      }
    }
  }, [app])

  return { state, actions };
}
