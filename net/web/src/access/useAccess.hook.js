import { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from 'context/AppContext';
import { ViewportContext } from 'context/ViewportContext';

export function useAccess() {

  const [state, setState] = useState({
    display: null,
  });

  const navigate = useNavigate();
  const location = useLocation();
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
    let params = new URLSearchParams(location);
    let token = params.get("access");
    if (token) {
      const access = async () => {
        try {
          await app.actions.access(token)
        }
        catch (err) {
          console.log(err);
        }
      }
      access();
    }
    // eslint-disable-next-line
  }, [navigate, location]);


  useEffect(() => {
    const { display } = viewport.state;
    updateState({ display });
  }, [viewport.state]);

  const actions = {};

  return { state, actions };
}

