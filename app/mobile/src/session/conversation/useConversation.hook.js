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
    editing: false,
    editTopicId: null,
    editData: null,
    editMessage: null,
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
    const filtered = sorted.filter(item => !(item.blocked === 1));
    updateState({ topics, subject, logo, host, topics: filtered });
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
    editTopic: async (topicId, data) => {
console.log("EDITING!");
      updateState({ editing: true, editTopicId: topicId, editData: data });
      //await conversation.actions.setTopicSubject(topicId, data);
    },
    hideEdit: () => {
      updateState({ editing: false });
    },
    updateTopic: () => {
      updateState({ editing: false });
    },
    setEditMessage: (editMessage) => {
      updateState({ editMessage });
    },
    blockTopic: async (topicId) => {
      await conversation.actions.blockTopic(topicId);
    }
  };

  return { state, actions };
}

