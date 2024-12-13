import { useState, useContext, useEffect, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { DisplayContext } from '../context/DisplayContext'
import { Focus, FocusDetail, Topic, Profile, Card, AssetSource, HostingMode, TransformType } from 'databag-client-sdk'
import { ContextType } from '../context/ContextType'

const img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII'

const LOAD_DEBOUNCE = 1000;

export function useConversation() {
  const app = useContext(AppContext) as ContextType
  const display = useContext(DisplayContext) as ContextType
  const [state, setState] = useState({
    detail: undefined as FocusDetail | null | undefined,
    strings: display.state.strings,
    cardId: null as null | string,
    detailSet: false,
    focus: null as Focus | null,
    layout: null,
    topics: [] as Topic[],
    loaded: false,
    loadingMore: false,
    profile: null as Profile | null,
    cards: new Map<string, Card>(),
    host: false,
    sealed: false,
    access: false,
    subject: '',
    subjectNames: [],
    unknownContacts: 0,
    message: '',
    assets: [] as {type: string, file: File}[],
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const { layout, strings } = display.state
    updateState({ layout, strings })
  }, [display.state])

  useEffect(() => {
    const host = state.cardId == null;
    const sealed = state.detail ? state.detail.sealed : false;
    const access = (state.detail != null);
    const subject = state.detail?.data?.subject ? state.detail.data.subject : null;
    const cards = Array.from(state.cards.values());
    const card = cards.find(entry => entry.cardId == state.cardId);
    const profileRemoved = state.detail?.members ? state.detail.members.filter(member => state.profile?.guid != member.guid) : [];
    const unhostedCards = profileRemoved.map(member => state.cards.get(member.guid));
    const contactCards = card ? [ card, ...unhostedCards ] : unhostedCards;
    const subjectCards = contactCards.filter(member => Boolean(member));
    const subjectNames = subjectCards.map(member => member?.name ? member.name : member?.handle);
    const unknownContacts = contactCards.length - subjectCards.length;
    updateState({ host, sealed, access, subject, subjectNames, unknownContacts, detailSet: state.detail !== undefined });
  }, [state.detail, state.cards, state.profile, state.cardId]);

  useEffect(() => {
    const focus = app.state.focus;
    const { contact, identity } = app.state.session || { };
    if (focus && contact && identity) {
      const setTopics = (topics: Topic[]) => {
        if (topics) {
          const sorted = topics.sort((a, b) => {
            if (a.created < b.created) {
              return -1;
            } else if (a.created > b.created) {
              return 1;
            } else {
              return 0;
            }
          });
          updateState({ topics: sorted, loaded: true });
        }
      }
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
        updateState({ detail, cardId });
      }
      updateState({ assets: [], message: '', topics: [], loaded: false });
      focus.addTopicListener(setTopics);
      focus.addDetailListener(setDetail);
      contact.addCardListener(setCards);
      identity.addProfileListener(setProfile);
      return () => {
        focus.removeTopicListener(setTopics);
        focus.removeDetailListener(setDetail);
        contact.removeCardListener(setCards);
        identity.removeProfileListener(setProfile);
      }
    }
  }, [app.state.focus]);

  const actions = {
    close: () => {
      app.actions.clearFocus();
    },
    setMessage: (message: string) => {
      updateState({ message });
    },
    more: async () => {
      const focus = app.state.focus;
      if (focus) {
        if (!state.loadingMore) {
          updateState({ loadingMore: true });
          await focus.viewMoreTopics();
          setTimeout(() => {
            updateState({ loadingMore: false });
          }, LOAD_DEBOUNCE);
        }
      }
    },
    send: async () => {
      const focus = app.state.focus;
      const sealed = state.detail?.sealed ? true : false;
      if (focus) {
        const subject = (assets: {assetId: string, appId: string}[]) => ({ text: state.message });
        const progress = (precent: number) => {};
        await focus.addTopic(sealed, sealed ? 'sealedtopic' : 'superbasictopic', subject, [], progress);
        updateState({ message: '' });
      }
    }, 
    addImage: (file: File) => {
      const type = 'image';
      updateState({ assets: [ ...state.assets, { type, file } ]});
    },
    add: async (file: File) => {
      const focus = app.state.focus;
      if (focus) {
        const asset = {
          name: 'topic',
          mimeType: 'image',
          extension: 'jpg',
          source: file,
          transforms: [ {type: TransformType.Thumb, thumb: ()=>(img), appId: '1'}, {type: TransformType.Copy, appId: '2'}],
        }
        const topicId = await focus.addTopic(true, 'sealedtopic', (assets: {assetId: string, appId: string}[])=>{
          console.log(assets);
          return { text: 'almost done', assets: [{ encrypted: { type: 'image', thumb: '0', parts: '1' } }] };
        }, [asset], (percent: number)=>{
          console.log(percent);
        });
      }
    },
  }

  return { state, actions }
}
