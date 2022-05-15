import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ConversationContext } from 'context/ConversationContext';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';

export function useConversation() {
  
  const [state, setState] = useState({
    init: true,
    cardId: null,
    channelId: null,
    subject: null,
    contacts: null,
    topics: [],
  });

  const { cardId, channelId } = useParams();
  const navigate = useNavigate();
  const conversation = useContext(ConversationContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    close: () => {
      navigate('/user')
    },
    setSubject: async (subject) => {
      await conversation.actions.setChannelSubject(subject);
    },
    remove: async () => {
      await conversation.actions.removeConversation();
      navigate('/user');
    }
  };

  useEffect(() => {
    conversation.actions.setConversationId(cardId, channelId);
  }, [cardId, channelId]);

  useEffect(() => {
    updateState({
      init: conversation.state.init,
      subject: conversation.state.subject,
      contacts: conversation.state.contacts,
      cardId: conversation.state.cardId,
      channelId: conversation.state.channelId,
      topics: Array.from(conversation.state.topics.values()),
    });
  }, [conversation]);

  return { state, actions };
}
