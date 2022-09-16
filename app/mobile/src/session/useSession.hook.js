import { useState, useEffect, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';

export function useSession() {

  const [state, setState] = useState({
  });

  const app = useContext(AppContext);
  const navigate = useNavigate();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    logout: async () => {
      await app.actions.logout();
      navigate('/');
    },
  };

  return { state, actions };
}

