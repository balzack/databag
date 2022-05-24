import { useContext, useState, useEffect, useRef } from 'react';
import { CardContext } from 'context/CardContext';
import { ConversationContext } from 'context/ConversationContext';

export function useMemberItem({ item }) {  

  const [state, setState] = useState({
    imageUrl: null,
    name: null,
    handle: null
  });

  const card = useContext(CardContext);
  const conversation = useContext(ConversationContext);

  useEffect(() => {
    updateState({ 
      imageUrl: card.actions.getImageUrl(item.card?.id),
      name: item.card?.data.cardProfile.name, 
      handle: item.card?.data.cardProfile.handle,
    });
  }, [item, card]);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setMembership: async () => {
      conversation.actions.setChannelCard(item.card.id);
    },
    clearMembership: async () => {
      conversation.actions.clearChannelCard(item.card.id);
    },
  };

  return { state, actions };
}
