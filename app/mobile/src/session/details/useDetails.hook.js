import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConversationContext } from 'context/ConversationContext';
import { CardContext } from 'context/CardContext';

export function useDetails() {

  const [state, setState] = useState({
    subject: null,
    created: null,
    logo: null,
    hostId: null,
    contacts: [],
    connected: [],
    editSubject: false,
    editMembers: false,
    subjectUpdate: null,
    pushEnabled: null,
  });

  const card = useContext(CardContext);
  const conversation = useContext(ConversationContext);
  const navigate = useNavigate();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const contacts = Array.from(card.state.cards.values());
    updateState({ connected: contacts.filter(contact => contact.detail.status === 'connected') });
  }, [card]);

  useEffect(() => {
    const { topic, subject, created, logo, host, contacts, pushEnabled } = conversation.state;
    updateState({ subject, created, logo, pushEnabled, hostId: host, subjectUpdate: topic,
      count: contacts.length, contacts: contacts.filter(card => card != null) });
  }, [conversation]);

  const actions = {
    showEditMembers: () => {
      updateState({ editMembers: true });
    },
    hideEditMembers: () => {
      updateState({ editMembers: false });
    },
    showEditSubject: () => {
      updateState({ editSubject: true });
    },
    hideEditSubject: () => {
      updateState({ editSubject: false });
    },
    setSubjectUpdate: (subjectUpdate) => {
      updateState({ subjectUpdate });
    },
    saveSubject: async () => {
      await conversation.actions.setSubject(state.subjectUpdate);
    },
    remove: async () => {
      await conversation.actions.remove();
    },
    block: async() => {
      await conversation.actions.setBlocked();
    },
    report: async() => {
      await conversation.actions.addReport();
    },
    setNotifications: async (notify) => {
      await conversation.actions.setNotifications(notify);
    },
  };

  return { state, actions };
}

