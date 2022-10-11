import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContext } from 'context/CardContext';
import { ConversationContext } from 'context/ConversationContext';

export function useMemberItem(item, members) {

  const [state, setState] = useState({
    name: null,
    handle: null,
    logo: null,
    cardId: null,
    member: false,
  });

  const conversation = useContext(ConversationContext);
  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const member = members.filter(contact => item.cardId === contact.cardId);
    updateState({ member: member.length > 0 });
  }, [members]);

  useEffect(() => {
    const { cardId, revision, profile } = item;
    const { name, handle, node } = profile;
    updateState({ cardId, name, handle: `${handle}@${node}`,
      logo: profile.imageSet ? card.actions.getCardLogo(cardId, revision) : 'avatar' });
  }, [card]);

  const actions = {
    setMember: (member) => {
      updateState({ member });
      if (member) {
        conversation.actions.setCard(item.cardId);
      }
      else {
        conversation.actions.clearCard(item.cardId);
      }
    },
  };

  return { state, actions };
}

