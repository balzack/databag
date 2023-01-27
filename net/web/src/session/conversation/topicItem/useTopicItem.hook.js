import { useEffect, useState } from 'react';

export function useTopicItem() {

  const [state, setState] = useState({
    editing: false,
    message: null,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setEditing: (message) => {
      updateState({ editing: true, message });
    },
    clearEditing: () => {
      updateState({ editing: false });
    },
    setMessage: (message) => {
      updateState({ message });
    },
  };

  return { state, actions };
}

