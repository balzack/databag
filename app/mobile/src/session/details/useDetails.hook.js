import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConversationContext } from 'context/ConversationContext';

export function useDetails() {

  const [state, setState] = useState({
    subject: null,
    created: null,
    logo: null,
    hostId: null,
    contacts: [],
    editSubject: false,
    subjectUpdate: null,
  });

  const conversation = useContext(ConversationContext);
  const navigate = useNavigate();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { topic, subject, created, logo, host, contacts } = conversation.state;
    updateState({ subject, created, logo, hostId: host, subjectUpdate: topic,
      count: contacts.length, contacts: contacts.filter(card => card != null) });
  }, [conversation]);

  const actions = {
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
  };

  return { state, actions };
}

