import { useContext, useState } from 'react';
import { AppContext } from 'context/AppContext';
import { useNavigate } from "react-router-dom";

export function useAdmin() {

  const [state, setState] = useState({
  });

  const navigate = useNavigate();
  const app = useContext(AppContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    onUser: () => {
      navigate('/login');
    },
  };

  return { state, actions };
}

