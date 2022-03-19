import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../AppContext/AppContext';
import { useNavigate } from "react-router-dom";

export function useProfile() {
  
  const [state, setState] = useState({});

  const navigate = useNavigate();
  const app = useContext(AppContext);

  const actions = {
    close: () => {
      navigate('/user')
    },
  };

  useEffect(() => {
  }, [app])

  return { state, actions };
}
