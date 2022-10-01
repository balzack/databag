import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';

export function useImageFile() {

  const [state, setState] = useState({
    ratio: 1,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setInfo: (width, height) => {
      updateState({ ratio: width / height });
    },
  };

  return { state, actions };
}

