import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConversationContext } from 'context/ConversationContext';

export function useDetails() {

  const [state, setState] = useState({
    subject: null,
    created: null,
    logo: null,
    hostId: null,
    contacts: null,
  });

  const conversation = useContext(ConversationContext);
  const navigate = useNavigate();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { subject, created, logo, host, contacts } = conversation.state;
    updateState({ subject, created, logo, hostId: host, contacts: contacts.filter(card => card != null) });
  }, [conversation]);

  const actions = {
  };

  return { state, actions };
}

