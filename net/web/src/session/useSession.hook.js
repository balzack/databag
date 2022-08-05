import { useState, useEffect } from 'react';

export function useSession() {

  const [state, setState] = useState({
    conversation: false,
    details: false,
    cards: false,
    contact: false,
    profile: false,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    setTimeout(() => {
      updateState({ cards: true });
    }, 1000);
    setTimeout(() => {
      updateState({ contact: true });
    }, 2000);
  }, []);

  const actions = {
    closeDetails: () => {
      updateState({ details: false });
    },
    closeCards: () => {
      updateState({ cards: false });
    },
    closeContact: () => {
      updateState({ contact: false });
    },
    closeProfile: () => {
      updateState({ profile: false });
    },
    closeConversation: () => {
      updateState({ conversation: false });
    },
  };

  return { state, actions };
}

