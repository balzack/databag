import { useState, useEffect, useRef, useContext } from 'react';

export function useSettings() {

  const [state, setState] = useState({
    lang: 0,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
  };

  return { state, actions };
}


