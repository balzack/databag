import { useRef, useState, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { AccountContext } from 'context/AccountContext';
import CryptoJS from 'crypto-js';
import { RSA } from 'react-native-rsa-native';

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
    keyboard: false,
    locked: false,
    sealKey: null,
  });

  const delay = useRef(null);
  const conversation = useContext(ConversationContext);
  const account = useContext(AccountContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

const converPem = (str) => {
  var result = '';
  while (str.length > 0) {
    result += str.substring(0, 64) + '\n';
    str = str.substring(64);
  }
  return result;
}

  useEffect(() => {
    let sealKey;
    const { locked, seals } = conversation.state;
    if (seals?.length) {
      seals.forEach(seal => {
        if (seal.publicKey === account.state.sealKey?.public) {
          const key = '-----BEGIN RSA PRIVATE KEY-----\n' + account.state.sealKey.private + '\n-----END RSA PRIVATE KEY-----'
          RSA.decrypt(seal.sealedKey, key).then(sealKey => {
            updateState({ locked, sealKey }); 
          });
        }
      });
    }
  }, [conversation.state.locked, conversation.state.seals, account.state.sealKey])

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
    updateState({ subject, logo, host, error, topics: filtered });
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
      if (state.locked) {
        await conversation.actions.setSealedTopicSubject(state.editTopicId, { ...state.editData, text: state.editMessage }, state.sealKey);
      }
      else {
        await conversation.actions.setTopicSubject(state.editTopicId, { ...state.editData, text: state.editMessage });
      }
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
    setKeyboard: () => {
      updateState({ keyboard: true });
    },
    clearKeyboard: () => {
      updateState({ keyboard: false });
    },
  };

  return { state, actions };
}

