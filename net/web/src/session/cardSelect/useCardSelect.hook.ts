import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';

export function useCardSelect(filter) {
  const [state, setState] = useState({
    cards: [],
  });

  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  };

  useEffect(() => {
    let contacts = Array.from(card.state.cards.values());
    let filtered = contacts.filter(filter);
    updateState({ cards: filtered });
  }, [card, filter]);

  const actions = {};

  return { state, actions };
}
