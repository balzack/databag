import { useState, useContext, useEffect, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { DisplayContext } from '../context/DisplayContext'
import { Focus, FocusDetail, Topic, Profile, Card, AssetSource, HostingMode, TransformType } from 'databag-client-sdk'
import { ContextType } from '../context/ContextType'

const img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII'

export function useConversation() {
  const app = useContext(AppContext) as ContextType
  const display = useContext(DisplayContext) as ContextType
  const [state, setState] = useState({
    focus: null as Focus | null,
    layout: null,
    strings: display.state.strings,
    topics: [] as Topic[],
    profile: null as Profile | null,
    cards: new Map<string, Card>(),
    host: false,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const { layout } = display.state
    updateState({ layout })
  }, [display.state])

  useEffect(() => {
    const focus = app.state.focus;
    const { contact, identity } = app.state.session || { };
    if (focus && contact && identity) {
      const setTopics = (topics: Topic[]) => {
        const sorted = topics.sort((a, b) => {
          if (a.created < b.created) {
            return -1;
          } else if (a.created > b.created) {
            return 1;
          } else {
            return 0;
          }
        });
        updateState({ topics: sorted });
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
        if (focused.cardId) {
          updateState({ host: false });
        } else {
          updateState({ host: true });
        }
        console.log(focused);
      }
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
    more: () => {
      const { focus } = app.state;
      if (focus) {
        focus.viewMoreTopics();
      }
    },
    add: async (file: File) => {
      const { focus } = app.state;
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
