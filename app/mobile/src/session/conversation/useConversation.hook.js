import { useState, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';

export function useConversation(cardId, channelId) {

  const [state, setState] = useState({
    topics: [],
    subject: null,
    logo: null,
  });

  const conversation = useContext(ConversationContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    conversation.actions.setChannel({ cardId, channelId });
  }, [cardId, channelId]);

  useEffect(() => {
    const { topics, subject, logo } = conversation.state;
    updateState({ topics, subject, logo });
  }, [conversation]);

  const actions = {
  };

  return { state, actions };
}

