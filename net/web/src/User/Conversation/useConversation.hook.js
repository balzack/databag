import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../AppContext/AppContext';
import { useNavigate, useLocation, useParams } from "react-router-dom";

export function useConversation() {
  
  const [state, setState] = useState({
  });

  const data = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const app = useContext(AppContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    close: () => {
      navigate('/user')
    },
  };

  useEffect(() => {
    if (app?.state?.access === 'user') {
      console.log("CONVERSATION:", id);
    }
  }, [app, id])

  return { state, actions };
}
