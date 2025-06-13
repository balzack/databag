import {useState, useContext, useEffect} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {RingContext} from '../context/RingContext';
import {ContextType} from '../context/ContextType';
import {Card} from 'databag-client-sdk';

export function useContacts() {
  const app = useContext(AppContext) as ContextType;
  const ring = useContext(RingContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    layout: '',
    strings: display.state.strings,
    cards: [] as Card[],
    filtered: [] as Card[],
    requested: [] as Card[],
    connected: [] as Card[],
    sortAsc: false,
    filter: '',
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const {strings, layout} = display.state;
    updateState({strings, layout});
  }, [display.state]);

  useEffect(() => {
    const contact = app.state.session?.getContact();
    const setCards = (cards: Card[]) => {
      const filtered = cards.filter(card => !card.blocked);
      updateState({cards: filtered});
    };
    contact.addCardListener(setCards);
    return () => {
      contact.removeCardListener(setCards);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const compare = (a: Card, b: Card) => {
      const aval = (`${a.handle}/${a.node}`).toLowerCase();
      const bval = (`${b.handle}/${b.node}`).toLowerCase();
      if (aval < bval) {
        return state.sortAsc ? 1 : -1;
      } else if (aval > bval) {
        return state.sortAsc ? -1 : 1;
      }
      return 0;
    };
    const select = (c: Card) => {
      if (!state.filter) {
        return true;
      }
      const value = state.filter.toLowerCase();
      if (c.name && c.name.toLowerCase().includes(value)) {
        return true;
      }
      const handle = c.node ? `${c.handle}/${c.node}` : c.handle;
      if (handle.toLowerCase().includes(value)) {
        return true;
      }
      return false;
    };
    const filtered = state.cards.sort(compare).filter(select);
    const requested = filtered.filter(item => item.status === 'requested' || item.status === 'pending');
    const connected = filtered.filter(item => item.status === 'connected');
    updateState({filtered, requested, connected});
  }, [state.sortAsc, state.filter, state.cards]);

  const actions = {
    toggleSort: () => {
      const sortAsc = !state.sortAsc;
      updateState({sortAsc});
    },
    setFilter: (filter: string) => {
      updateState({filter});
    },
    call: async (card: Card) => {
      await ring.actions.call(card);
    },
    text: async (cardId: string) => {
      console.log('text', cardId);
    },
    cancel: async (cardId: string) => {
      const contact = app.state.session?.getContact();
      await contact.disconnectCard(cardId);
    },
    connect: async (cardId: string) => {
      const contact = app.state.session?.getContact();
      await contact.connectCard(cardId);
    },
    accept: async (cardId: string) => {
      const contact = app.state.session?.getContact();
      await contact.connectCard(cardId);
    },
    resync: async (cardId: string) => {
      const contact = app.state.session?.getContact();
      await contact.resyncCard(cardId);
    },
  };

  return {state, actions};
}
