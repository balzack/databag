import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConversationContext } from 'context/ConversationContext';

export function useDetails() {

  const [state, setState] = useState({
    subject: null,
    created: null,
    logo: null,
    mode: null,
  });

  const conversation = useContext(ConversationContext);
  const navigate = useNavigate();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { subject, created, logo, host } = conversation.state;
    updateState({ subject, created, logo, mode: host ? 'guest' : 'host' });
  }, [conversation]);

  const actions = {
  };

  return { state, actions };
}

