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
    const { subject, logo, topics } = conversation.state;
    const items = Array.from(topics.values());
    const sorted = items.sort((a, b) => {
      const aTimestamp = a?.detail?.created;
      const bTimestamp = b?.detail?.created;
      if(aTimestamp === bTimestamp) {
        return 0;
      }
      if(aTimestamp == null || aTimestamp < bTimestamp) {
        return 1;
      }
      return -1;
    });
    updateState({ topics, subject, logo, topics: sorted });
  }, [conversation]);

  const actions = {
  };

  return { state, actions };
}

