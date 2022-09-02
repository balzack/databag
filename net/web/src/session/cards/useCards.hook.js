import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';
import { ViewportContext } from 'context/ViewportContext';

export function useCards() {

  const [filter, setFilter] = useState(null);

  const [state, setState] = useState({
    sorted: false,
    display: null,
    cards: [],
    busy: false 
  });

  const card = useContext(CardContext);
  const viewport = useContext(ViewportContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    onFilter: (value) => {
      setFilter(value.toUpperCase());
    },
    setSort: (value) => {
      updateState({ sorted: value });
    },
  };

  useEffect(() => {
    const contacts = Array.from(card.state.cards.values());

    let filtered = contacts.filter((contact) => {
      if (!filter) {
        return true;
      }
      if (!contact?.data?.cardProfile?.name) {
        return false;
      }
      return contact.data.cardProfile.name.toUpperCase().includes(filter);
    });

    if (state.sorted) {
      filtered.sort((a, b) => {
        let aName = a?.data?.cardProfile?.name;
        let bName = b?.data?.cardProfile?.name;
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
        const aUpdated = a?.data?.cardDetail?.statusUpdated;
        const bUpdated = b?.data?.cardDetail?.statusUpdated;
        if (aUpdated === bUpdated) {
          return 0;
        }
        if (!aUpdated || (aUpdated < bUpdated)) {
          return 1;
        }
        return -1;
      });
    }

    updateState({ cards: filtered });

  }, [card, filter, state.sorted]);

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  return { state, actions };
}
