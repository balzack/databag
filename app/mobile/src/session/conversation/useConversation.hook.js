import { useState, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';

export function useConversation() {

  const [state, setState] = useState({
    topics: [],
    subject: null,
    logo: null,
    latched: true,
    momentum: false,
    focus: null,
    host: null,
  });

  const conversation = useContext(ConversationContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { subject, logo, topics, host } = conversation.state;
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
    updateState({ topics, subject, logo, host, topics: sorted });
  }, [conversation]);

  const actions = {
    latch: () => {
      updateState({ latched: true });
    },
    unlatch: () => {
      updateState({ latched: false });
    },
    setMomentum: () => {
      updateState({ momentum: true });
    },
    clearMomentum: () => {
      updateState({ momentum: false });
    },
    setFocus: (focus) => {
      updateState({ focus });
    },
    removeTopic: async (topicId) => {
      await conversation.actions.removeTopic(topicId);
    },
  };

  return { state, actions };
}

