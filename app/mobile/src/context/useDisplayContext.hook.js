import { useEffect, useContext, useState, useRef } from 'react';

export function useDisplayContext() {
  const [state, setState] = useState({
    prompt: null,
    alert: null,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const actions = {
    showPrompt: (prompt) => {
      updateState({ prompt });
    },
    hidePrompt: () => {
      updateState({ prompt: null });
    },
    showAlert: (alert) => {
      updateState({ alert });
    },
    hideAlert: () => {
      updateState({ alert: null });
    },
  };

  return { state, actions }
}

