import { useContext, useState, useEffect } from 'react';
import { AppContext } from 'context/AppContext';
import { useNavigate } from 'react-router-dom'

export function useRoot() {

  const [state, setState] = useState({});
  const app = useContext(AppContext);
  const navigate = useNavigate();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {

    if (app.state.session === true) {
      navigate('/session');
    }
    if (app.state.session === false) {
      navigate('/login');
    }
  }, [app]);

  const actions = {
  };

  return { state, actions };
}

