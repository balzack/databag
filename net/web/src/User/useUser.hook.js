import { useContext, useState, useEffect } from 'react';

export function useUser() {
  
  const [state, setState] = useState({});

  const actions = {
    updateState: (value) => {
      setState((s) => ({ ...s, ...value }));
    },
  };

  return { state, actions };
}
