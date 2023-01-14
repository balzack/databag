import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';
import { ViewportContext } from 'context/ViewportContext';

export function useCardItem(item) {

  const [state, setState] = useState({
    logo: null,
    resync: false,
  });

  const card = useContext(CardContext);
  const viewport = useContext(ViewportContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ logo: card.actions.getCardImageUrl(item.id) });
  }, [card, item]); 

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

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

