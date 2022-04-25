import { useContext, useState, useEffect } from 'react';

export function useContacts() {
  
  const [state, setState] = useState({});

  const actions = {};

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  return { state, actions };
}
