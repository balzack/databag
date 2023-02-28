import { useEffect, useState, useContext } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { CardContext } from 'context/CardContext';
import { ConversationContext } from 'context/ConversationContext';
import { getChannelSubjectLogo } from 'context/channelUtil';

export function useConversation() {
  const [state, setState] = useState({
    subject: null,
    logo: null,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const profile = useContext(ProfileContext);
  const card = useContext(CardContext);
  const conversation = useContext(ConversationContext);

  useEffect(() => {
    const cardId = conversation.state.card?.cardId;
    const profileGuid = profile.state.identity?.guid;
    const channel = conversation.state.channel;
    const cards = card.state.cards;
    cardImageUrl = card.actions.getCardImageUrl;
    const { logo, subject } = getChannelSubjectLogo(cardId, profileGuid, channel, cards, cardImageUrl);
    updateState({ logo, subject });
  }, [conversation.state, card.state, profile.state]);
    

  const actions = {};

  return { state, actions };
}

