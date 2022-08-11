import { useState, useEffect, useContext } from 'react';
import { ViewportContext } from 'context/ViewportContext';

export function useAddTopic() {

  const [state, setState] = useState({
    mode: null
  });

  const viewport = useContext(ViewportContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (viewport.state.display === 'small') {
      updateState({ mode: 'button' });
    }
    else {
      updateState({ mode: 'bar' });
    }
  }, [viewport]);

  const actions = {
  };

  return { state, actions };
}

