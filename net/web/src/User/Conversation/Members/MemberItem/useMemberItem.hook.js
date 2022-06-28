import { useContext, useState, useEffect, useRef } from 'react';
import { CardContext } from 'context/CardContext';
import { ProfileContext } from 'context/ProfileContext';
import { ConversationContext } from 'context/ConversationContext';

export function useMemberItem({ item }) {  

  const [state, setState] = useState({
    imageUrl: null,
    name: null,
    handle: null,
    busy: false,
  });

  const card = useContext(CardContext);
  const profile = useContext(ProfileContext);
  const conversation = useContext(ConversationContext);

  useEffect(() => {
    let handle = item.card?.data.cardProfile.handle;
    if (item.card?.data.cardProfile.node != profile.state?.profile.node) {
      handle += '@' + item.card?.data.cardProfile.node;
    }
    updateState({ 
      imageUrl: card.actions.getImageUrl(item.card?.id),
      name: item.card?.data.cardProfile.name, 
      handle,
    });
  }, [item, card, profile]);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setMembership: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          conversation.actions.setChannelCard(item.card.id);
        }
        catch(err) {
          window.alert(err);
        }
        updateState({ busy: false });
      }
    },
    clearMembership: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          conversation.actions.clearChannelCard(item.card.id);
        }
        catch(err) {
          window.alert(err);
        }
        updateState({ busy: false });
      }
    },
  };

  return { state, actions };
}
