import { useEffect, useState, useContext, useRef } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { CardContext } from 'context/CardContext';
import { AccountContext } from 'context/AccountContext';
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
  const account = useContext(AccountContext);

  useEffect(() => {
    const cardId = conversation.state.card?.cardId;
    const profileGuid = profile.state.identity?.guid;
    const channel = conversation.state.channel;
    const cards = card.state.cards;
    cardImageUrl = card.actions.getCardImageUrl;
    const { logo, subject } = getChannelSubjectLogo(cardId, profileGuid, channel, cards, cardImageUrl);

    const items = Array.from(conversation.state.topics.values());
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

    updateState({ logo, subject, topics: filtered });
  }, [conversation.state, profile.state]);
    

  const actions = {};

  return { state, actions };
}

