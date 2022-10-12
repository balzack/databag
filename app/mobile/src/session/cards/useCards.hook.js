import { useState, useEffect, useRef, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { CardContext } from 'context/CardContext';
import config from 'constants/Config';

export function useCards() {

  const [state, setState] = useState({
    tabbed: null,
    cards: [],
    filter: null,
    sorting: false,
  });

  const dimensions = useWindowDimensions();
  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (dimensions.width > config.tabbedWidth) {
      updateState({ tabbed: false });
    }
    else {
      updateState({ tabbed: true });
    }
  }, [dimensions]);

  const setCardItem = (item) => {
    const { profile, detail } = item;
    
    return {
      cardId: item.cardId,
      name: profile.name,
      handle: `${profile.handle}@${profile.node}`,
      status: detail.status,
      offsync: item.offsync,
      blocked: item.blocked,
      updated: detail.statusUpdated,
      logo: profile.imageSet ? card.actions.getCardLogo(item.cardId, profile.revision) : 'avatar',
    }
  };

  useEffect(() => {
    const cards = Array.from(card.state.cards.values());
    const items = cards.map(setCardItem);
    const filtered = items.filter(item => {
      if (!state.filter) {
        return !item.blocked;
      }
      const lower = state.filter.toLowerCase();
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
    if (state.sorting) {
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
    filtered.push({cardId:''});
    updateState({ cards: filtered }); 
  }, [card, state.filter, state.sorting]);

  const actions = {
    setFilter: (filter) => {
      updateState({ filter });
    },
    sort: () => {
      updateState({ sorting: true });
    },
    unsort: () => {
      updateState({ sorting: false });
    },
  };

  return { state, actions };
}

