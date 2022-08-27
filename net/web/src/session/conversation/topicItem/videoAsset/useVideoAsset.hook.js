import { useContext, useState, useEffect, useRef } from 'react';
import { ViewportContext } from 'context/ViewportContext';

export function useVideoAsset() {

  const [state, setState] = useState({
    display: null,
    width: 0,
    height: 0,
    active: false,
  });

  const viewport = useContext(ViewportContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, []);

  const actions = {
    setActive: (width, height, url) => {
console.log(width, height);
      updateState({ active: true, width, height });
    },
    clearActive: () => {
      updateState({ active: false });
    },
  };

  return { state, actions };
}

