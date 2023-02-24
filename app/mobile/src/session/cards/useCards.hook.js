import { useState, useEffect, useRef, useContext } from 'react';
import { CardContext } from 'context/CardContext';

export function useCards(filter, sort) {

  const [state, setState] = useState({
    cards: [],
  });

  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const setCardItem = (item) => {
    const { profile, detail, cardId } = item.card || { profile: {}, detail: {} }
    const { name, handle, node, guid, location, description, imageSet } = profile;

    return {
      cardId: cardId,
      name: name,
      handle: handle,
      node: node,
      guid: guid,
      location: location,
      description: description,
      status: detail.status,
      offsync: item.offsync,
      blocked: item.blocked,
      offsync: item.offsync,
      updated: detail.statusUpdated,
      logo: imageSet ? card.actions.getCardImageUrl(cardId) : 'avatar',
    }
  };

  useEffect(() => {
    const cards = Array.from(card.state.cards.values());
    const items = cards.map(setCardItem);
    const filtered = items.filter(item => {
      if (item.blocked) {
        return false;
      }
      if (!filter) {
        return true;
      }
      const lower = filter.toLowerCase();
      if (item.name) {
        if (item.name.toLowerCase().includes(lower)) {
          return true;
        }
      }
      if (item.handle) {
        if (item.handle.toLowerCase().includes(lower)) {
          return true;
        }
      }
      return false;
    })
    if (sort) {
      filtered.sort((a, b) => {
        const aName = a?.name?.toLowerCase();
        const bName = b?.name?.toLowerCase();
        if (aName === bName) {
          return 0;
        }
        if (!aName || (aName < bName)) {
          return -1;
        }
        return 1;
      });
    }
    else {
      filtered.sort((a, b) => {
        if (a.updated === b.updated) {
          return 0;
        }
        if (!a.updated || (a.updated < b.updated)) {
          return 1;
        }
        return -1;
      });
    }
    updateState({ cards: filtered }); 
  }, [card, filter, sort]);

  const actions = {
  };

  return { state, actions };
}


