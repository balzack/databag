import { useContext, useState, useEffect, useRef } from 'react';
import { CardContext } from 'context/CardContext';

export function useMemberItem({ item }) {  

  const [state, setState] = useState({
    imageUrl: null,
    name: null,
    handle: null
  });

  const card = useContext(CardContext);

  useEffect(() => {
    updateState({ 
      imageUrl: card.actions.getImageUrl(item.card.id),
      name: item.card?.data.cardProfile.name, 
      handle: item.card?.data.cardProfile.handle,
    });
  }, [item, card]);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setMembership: async () => {
      console.log("set membership");
    },
    clearMembership: async () => {
      console.log("clear membership");
    },
  };

  return { state, actions };
}
