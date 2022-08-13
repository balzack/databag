import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';
import { ViewportContext } from 'context/ViewportContext';

export function useCards() {

  const [filter, setFilter] = useState(null);

  const [state, setState] = useState({
    sorted: false,
    display: null,
    cards: [],
    busy: false }
  );

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
        if (a?.data?.cardProfile?.name > b?.data?.cardProfile?.name) {
          return -1;
        }
        return 1;
      });
    }
    else {
      filtered.sort((a, b) => {
        if (a?.data?.cardDetails?.statusUpdated > b?.data?.cardDetails?.statusUpdated) {
          return -1;
        }
        return 1;
      });
    }

    updateState({ cards: filtered });

  }, [card, filter, state.sorted]);

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  return { state, actions };
}
