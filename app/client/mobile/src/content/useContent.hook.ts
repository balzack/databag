import {useState, useContext, useEffect, useRef} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';
import {Channel, Card} from 'databag-client-sdk';
import {notes, unknown, iii_group, iiii_group, iiiii_group, group} from '../constants/Icons';

type ChannelParams = {
  cardId: string;
  channelId: string;
  sealed: boolean;
  hosted: boolean;
  unread: boolean;
  imageUrl: string;
  subject: (string | null)[];
  message: string;
};

export function useContent() {
  const cardChannels = useRef(new Map<string | null, Channel[]>());
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    strings: display.state.strings,
    layout: null,
    guid: '',
    cards: [] as Card[],
    sorted: [] as Channel[],
    filtered: [] as ChannelParams[],
    filter: '',
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const {layout} = display.state;
    updateState({layout});
  }, [display.state]);

  useEffect(() => {
    const channels = state.sorted.map(channel => {
      const {cardId, channelId, unread, sealed, members, data, lastTopic} = channel;
      const contacts = [];
      if (cardId) {
        const card = state.cards.find(contact => contact.cardId === cardId);
        if (card) {
          contacts.push(card);
        }
      }
      const guests = members.filter(contact => contact !== state.guid);
      const guestCards = guests
        .map(contact => state.cards.find(card => card.guid === contact.guid))
        .sort((a, b) => {
          if (!a && !b) {
            return 0;
          } else if (!a) {
            return 1;
          } else if (!b) {
            return -1;
          } else if (a.handle > b.handle) {
            return 1;
          } else {
            return 0;
          }
        });
      contacts.push(...guestCards);

      const buildSubject = () => {
        if (contacts.length === 0) {
          return [];
        }
        return contacts.map(contact => (contact ? contact.handle : null));
      };

      const selectImage = () => {
        if (contacts.length === 0) {
          return notes;
        } else if (contacts.length === 1) {
          if (contacts[0]) {
            return contacts[0].imageUrl;
          } else {
            return unknown;
          }
        } else if (contacts.length === 2) {
          return iii_group;
        } else if (contacts.length === 3) {
          return iiii_group;
        } else if (contacts.length === 4) {
          return iiiii_group;
        } else {
          return group;
        }
      };

      const hosted = cardId == null;
      const subject = data?.subject ? [data.subject] : buildSubject();
      const message = lastTopic ? (lastTopic.data ? lastTopic.data.text : null) : '';
      const imageUrl = selectImage();

      return {
        cardId,
        channelId,
        sealed,
        hosted,
        unread,
        imageUrl,
        subject,
        message,
      };
    });

    const search = state.filter?.toLowerCase();
    const filtered = channels.filter(item => {
      if (search) {
        if (item.subject?.find(value => value?.toLowerCase().includes(search))) {
          return true;
        }
        if (item.message?.toLowerCase().includes(search)) {
          return true;
        }
        return false;
      }
      return true;
    });

    updateState({filtered});
  }, [state.sorted, state.cards, state.guid, state.filter]);

  useEffect(() => {
    const setProfile = (profile: Profile) => {
      const {guid} = profile;
      updateState({guid});
    };
    const setCards = (cards: Card[]) => {
      updateState({cards});
    };
    const setChannels = ({channels, cardId}) => {
      cardChannels.current.set(cardId, channels);
      const merged = [];
      cardChannels.current.forEach(values => {
        merged.push(...values);
      });
      const sorted = merged.sort((a, b) => {
        const aUpdated = a?.lastTopic?.created;
        const bUpdated = b?.lastTopic?.created;
        if (aUpdated === bUpdated) {
          return 0;
        } else if (!aUpdated) {
          return 1;
        } else if (!bUpdated) {
          return -1;
        } else if (aUpdated < bUpdated) {
          return 1;
        } else {
          return -1;
        }
      });
      updateState({sorted});
    };

    const {identity, contact, content} = app.state.session;
    identity.addProfileListener(setProfile);
    contact.addCardListener(setCards);
    content.addChannelListener(setChannels);

    return () => {
      identity.removeProfileListener(setProfile);
      contact.removeCardListener(setCards);
      content.removeChannelListener(setChannels);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actions = {
    setFilter: filter => {
      updateState({filter});
    },
    getFocus: (cardId: string | null, channelId: string) => {
      return app.state.session.setFocus(cardId, channelId);
    },
  };

  return {state, actions};
}
