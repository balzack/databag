import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../AppContext/AppContext';
import { useNavigate, useLocation, useParams } from "react-router-dom";

export function useContact() {
  
  const [state, setState] = useState({});

  const data = useLocation();
  const { guid } = useParams();
  const navigate = useNavigate();
  const app = useContext(AppContext);

  console.log(data.state);
  console.log(guid);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    close: () => {
      navigate('/user')
    },
  };

  useEffect(() => {
  }, [app])

  return { state, actions };
}
