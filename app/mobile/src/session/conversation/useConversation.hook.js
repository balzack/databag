import { useRef, useState, useEffect, useContext } from 'react';
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
    init: false,
    error: false,
  });

  const delay = useRef(null);
  const conversation = useContext(ConversationContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { error, subject, logo, topics, host, init } = conversation.state;
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
    updateState({ topics, subject, logo, host, error, topics: filtered });
    if (init) {
      clearTimeout(delay.current);
      updateState({ init: true });
    }
    else {
      if (!delay.current) {
        delay.current = setTimeout(() => {
          updateState({ init: false });
        }, 500);
      }
    }
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
      updateState({ editing: true, editTopicId: topicId, editMessage: data.text, editData: data });
    },
    hideEdit: () => {
      updateState({ editing: false });
    },
    updateTopic: async () => {
      await conversation.actions.setTopicSubject(state.editTopicId, { ...state.editData, text: state.editMessage });
    },
    setEditMessage: (editMessage) => {
      updateState({ editMessage });
    },
    blockTopic: async (topicId) => {
      await conversation.actions.blockTopic(topicId);
    },
    reportTopic: async (topicId) => {
      await conversation.actions.addTopicReport(topicId);
    },
    resync: () => {
      conversation.actions.resync();
    },
  };

  return { state, actions };
}

