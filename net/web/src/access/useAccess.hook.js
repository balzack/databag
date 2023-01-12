import { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from 'context/AppContext';
import { ViewportContext } from 'context/ViewportContext';

export function useAccess() {

  const [state, setState] = useState({
    display: null,
  });

  const navigate = useNavigate();
  const app = useContext(AppContext);
  const viewport = useContext(ViewportContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (app.state.status) {
      navigate('/session');
    }
  }, [app.state, navigate]);

  useEffect(() => {
    const { display } = viewport.state;
    updateState({ display });
  }, [viewport.state]);

  const actions = {};

  return { state, actions };
}

