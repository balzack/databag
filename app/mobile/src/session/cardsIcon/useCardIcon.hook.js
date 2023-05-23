import { useState, useEffect, useContext } from 'react';
import { CardContext } from 'context/CardContext';

export function useCardIcon() {

  const [state, setState] = useState({
    requested: false,
    offsync: false,
  });

  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    let requested = false;
    let offsync = false;
    card.state.cards.forEach(item => {
      const status = item.card?.detail?.status;
      if (status === 'pending' || status === 'requested') {
        requested = true;
      }
      if (item.card?.offsync && status === 'connected') {
        offsync = true;
      }
    });
    updateState({ requested, offsync }); 
  }, [card.state]);

  const actions = {};

  return { state, actions };
}
