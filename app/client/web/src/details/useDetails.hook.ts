import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { DisplayContext } from '../context/DisplayContext'
import { ContextType } from '../context/ContextType'
import { FocusDetail, Card, Profile } from 'databag-client-sdk';

export function useDetails() {
  const display = useContext(DisplayContext) as ContextType
  const app = useContext(AppContext) as ContextType
  const [state, setState] = useState({
    cardId: null as null | string,
    channelId: '',
    detail: undefined as undefined | FocusDetail,
    access: false,
    host: false,
    sealed: false,
    locked: false,
    strings: display.state.strings,
    timeFormat: display.state.timeFormat,
    dateFormat: display.state.dateFormat,
    subject: '',
    editSubject: '',
    created: '',
    profile: null as null | Profile,
    cards: new Map<string, Card>(),
    hostCard: null as null | Card,
    channelCards: [] as Card[],
    unknownContacts: 0,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  const getTimestamp = (created: number) => {
    const now = Math.floor((new Date()).getTime() / 1000)
    const date = new Date(created * 1000);
    const offset = now - created;
    if(offset < 43200) {
      if (state.timeFormat === '12h') {
        return date.toLocaleTimeString("en-US", {hour: 'numeric', minute:'2-digit'});
      }
      else {
        return date.toLocaleTimeString("en-GB", {hour: 'numeric', minute:'2-digit'});
      }
    }
    else if (offset < 31449600) {
      if (state.dateFormat === 'mm/dd') {
        return date.toLocaleDateString("en-US", {day: 'numeric', month:'numeric'});
      }
      else {
        return date.toLocaleDateString("en-GB", {day: 'numeric', month:'numeric'});
      }
    }
    else {
      if (state.dateFormat === 'mm/dd') {
        return date.toLocaleDateString("en-US");
      }
      else {
        return date.toLocaleDateString("en-GB");
      }
    }
  }
  
  useEffect(() => {
    const { strings, timeFormat, dateFormat } = display.state;
    updateState({ strings, timeFormat, dateFormat });
  }, [display.state]);

  useEffect(() => {
    const cards = Array.from(state.cards.values());
    const hostCard = cards.find(entry => entry.cardId == state.cardId);
    const profileRemoved = state.detail?.members ? state.detail.members.filter(member => state.profile?.guid != member.guid) : [];
    const contactCards = profileRemoved.map(member => state.cards.get(member.guid));
    const channelCards = contactCards.filter(member => Boolean(member));
    const unknownContacts = contactCards.length - channelCards.length;
    updateState({ hostCard, channelCards, unknownContacts });
  }, [state.detail, state.cards, state.profile, state.cardId]);

  useEffect(() => {
    const focus = app.state.focus;
    const { contact, identity } = app.state.session || { };
    if (focus && contact && identity) {
      const setCards = (cards: Card[]) => {
        const contacts = new Map<string, Card>();
        cards.forEach(card => {
          contacts.set(card.guid, card);
        });
        updateState({ cards: contacts });
      }
      const setProfile = (profile: Profile) => {
        updateState({ profile });
      }
      const setDetail = (focused: { cardId: string | null, channelId: string, detail: FocusDetail | null }) => {
        const detail = focused ? focused.detail : null;
        const cardId = focused.cardId;
        const channelId = focused.channelId;
        const access = Boolean(detail);
        const sealed = detail?.sealed;
        const locked = detail?.locked;
        const host = cardId == null;
        const subject = detail?.data?.subject ? detail.data.subject : '';
        const created = detail?.created ? getTimestamp(detail.created) : '';
        updateState({ detail, editSubject: subject, subject, channelId, cardId, access, sealed, locked, host, created });
      }
      focus.addDetailListener(setDetail);
      contact.addCardListener(setCards);
      identity.addProfileListener(setProfile);
      return () => {
        focus.removeDetailListener(setDetail);
        contact.removeCardListener(setCards);
        identity.removeProfileListener(setProfile);
      }
    }
  }, [app.state.focus, state.timeFormat, state.dateFormat]);

  const actions = {
    setEditSubject: (editSubject: string) => {
      updateState({ editSubject });
    },
    undoSubject: () => {
      updateState({ editSubject: state.subject });
    },
    saveSubject: async () => {
      const content = app.state.session.getContent()
      await content.setChannelSubject(state.channelId, state.sealed ? 'sealed' : 'superbasic', { subject: state.editSubject });
    },
  }

  return { state, actions }
}
