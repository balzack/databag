import {useState, useContext, useEffect, useRef} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';
import {Config} from 'databag-client-sdk';
import {FocusDetail, Card, Profile} from 'databag-client-sdk';

export function useMembers() {
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    detail: undefined as undefined | FocusDetail,
    sealed: false,
    sealUnlocked: false,
    sealSet: false,
    strings: display.state.strings,
    connected: [] as Card[],
    host: false,
    channelId: '',
  });

  const compare = (a: Card, b: Card) => {
    const aval = (`${a.handle}/${a.node}`).toLowerCase();
    const bval = (`${b.handle}/${b.node}`).toLowerCase();
    if (aval < bval) {
      return -1;
    } else if (aval > bval) {
      return 1;
    }
    return 0;
  };

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const focus = app.state.focus;
    const contact = app.state?.session?.getContact();
    const setCards = (cards: Card[]) => {
      const sorted = cards.sort(compare);
      const connected = [] as Card[];
      sorted.forEach(card => {
        if (card.status === 'connected') {
          connected.push(card);
        }
      });
      updateState({connected});
    };
    const setDetail = (focused: {cardId: string | null; channelId: string; detail: FocusDetail | null}) => {
      const detail = focused ? focused.detail : null;
      const cardId = focused.cardId;
      const channelId = focused.channelId;
      const access = Boolean(detail);
      const sealed = detail?.sealed;
      const locked = detail ? detail.locked : true;
      const host = cardId == null;
      updateState({ channelId, detail, access, sealed, locked, host });
    };
    if (focus && contact) {
      contact.addCardListener(setCards);
      focus.addDetailListener(setDetail);
      return () => {
        focus.removeDetailListener(setDetail);
        contact.removeCardListener(setCards);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.state.session]);

  useEffect(() => {
    const {layout} = display.state;
    updateState({layout});
  }, [display.state]);

  const actions = {
    setMember: async (cardId: string) => {
      const content = app.state.session.getContent();
      await content.setChannelCard(state.channelId, cardId);
    },
    clearMember: async (cardId: string) => {
      const content = app.state.session.getContent();
      await content.clearChannelCard(state.channelId, cardId);
    },
  };

  return {state, actions};
}
