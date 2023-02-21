import { useState, useEffect, useContext } from 'react';
import { CardContext } from 'context/CardContext';

export function useBlockedContacts() {

  const [state, setState] = useState({
    cards: [],
  });

  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const setCardItem = (item) => {
    const { profile } = item;
    return {
      cardId: item.cardId,
      name: profile?.name,
      handle: `${profile?.handle}@${profile?.node}`,
      blocked: item.blocked,
      logo: profile?.imageSet ? card.actions.getCardImageUrl(item.cardId) : 'avatar',
    }
  };

  useEffect(() => {
    const cards = Array.from(card.state.cards.values());
    const items = cards.map(setCardItem);
    const filtered = items.filter(item => {
      return item.blocked;
    });
    filtered.sort((a, b) => {
      if (a.name === b.name) {
        return 0;
      }
      if (!a.name || (a.name < b.name)) {
        return -1;
      }
      return 1;
    });
    updateState({ cards: filtered });
  }, [card]);

  const actions = {
    unblock: async (cardId) => {
      await card.actions.clearCardBlocked(cardId);
    }
  };

  return { state, actions };
}

