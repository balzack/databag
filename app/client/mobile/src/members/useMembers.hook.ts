import {useState, useContext, useEffect} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';
import {FocusDetail, Card} from 'databag-client-sdk';

export function useMembers() {
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    sealed: false,
    sealUnlocked: false,
    sealSet: false,
    strings: display.state.strings,
    sorted: [] as Card[],
    filtered: [] as Card[],
    members: [] as string[],
    host: false,
    channelId: '',
  });

  const compare = (a: Card, b: Card) => {
    const aval = `${a.handle}/${a.node}`.toLowerCase();
    const bval = `${b.handle}/${b.node}`.toLowerCase();
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
      updateState({sorted});
    };
    const setDetail = (focused: {cardId: string | null; channelId: string; detail: FocusDetail | null}) => {
      const cardId = focused.cardId;
      const channelId = focused.channelId;
      const detail = focused.detail;
      const access = Boolean(detail);
      const sealed = detail?.sealed;
      const locked = detail ? detail.locked : true;
      const members = detail ? detail.members.map(item => item.guid) : [];
      const host = cardId == null;
      updateState({channelId, members, access, sealed, locked, host});
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
  }, [app.state.session, app.state.focus]);

  useEffect(() => {
    const filtered = state.sorted.filter(item => item.status === 'connected' || state.members.includes(item.guid));
    updateState({filtered});
  }, [state.members, state.sorted]);

  useEffect(() => {
    const {strings, layout} = display.state;
    updateState({strings, layout});
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
