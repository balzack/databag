import { useContext, useState, useEffect, useRef } from 'react';
import { ViewportContext } from 'context/ViewportContext';

export function useImageAsset() {

  const [state, setState] = useState({
    display: null,
    popout: false,
    width: 0,
    height: 0,
  });

  const viewport = useContext(ViewportContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, []);

  const actions = {
    setPopout: (width, height) => {
      updateState({ popout: true, width, height });
    },
    clearPopout: () => {
console.log("CLEAR POPOUT");
      updateState({ popout: false });
    },
  };

  return { state, actions };
}
