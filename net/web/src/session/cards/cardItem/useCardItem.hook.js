import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';

export function useCardItem(item) {

  const [state, setState] = useState({
    logo: null,
    resync: false,
  });

  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ logo: card.actions.getImageUrl(item.id) });
  }, [card]); 

  const actions = {
    resync: async () => {
      if (!state.resync) {
        updateState({ resync: true });
        await card.actions.resync(item.id);
        updateState({ resync: false });
      }
    },
  };

  return { state, actions };
}

