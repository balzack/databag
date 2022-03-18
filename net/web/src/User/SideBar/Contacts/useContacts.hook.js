import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../../AppContext/AppContext';

export function useContacts() {
  
  const [state, setState] = useState({});

  const actions = {};

  const app = useContext(AppContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {}, [app])

  return { state, actions };
}
