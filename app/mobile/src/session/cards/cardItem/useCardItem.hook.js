import { useState, useEffect, useRef, useContext } from 'react';
import { useWindowDimensions } from 'react-native';

export function useCardItem(item) {

  const [state, setState] = useState({});

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
  };

  return { state, actions };
}

