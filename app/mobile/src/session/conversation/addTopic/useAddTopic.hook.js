import { useState, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';

export function useAddTopic(cardId, channelId) {

  const [state, setState] = useState({
    message: null,
  });

  const conversation = useContext(ConversationContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setMessage: (message) => {
      updateState({ message });
    },
  };

  return { state, actions };
}

