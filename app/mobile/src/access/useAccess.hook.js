import { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';

export function useAccess() {

  const [state, setState] = useState({
    split: null,
  });
  const dimensions = useWindowDimensions();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (dimensions.width > 650) {
      updateState({ split: true });
    }
    else {
      updateState({ split: false });
    }
  }, [dimensions]);

  const actions = {
  };

  return { state, actions };
}

