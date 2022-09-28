import { useState, useEffect, useRef, useContext } from 'react';
import { StoreContext } from 'context/StoreContext';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';
import { ProfileContext } from 'context/ProfileContext';

export function useConversationContext() {
  const [state, setState] = useState({
    subject: null,
    logo: null,
    contacts: [],
    topics: [],
  });
  const store = useContext(StoreContext);
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const profile = useContext(ProfileContext);
  const topics = useRef(new Map());
  const revision = useRef(0);
  const syncing = useRef(false);
  const cardId = useRef(null);
  const channelId = useRef(null);
  const setView = useRef(0);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const sync = async () => {
    const curView = setView.current;
    const item = getChannel(cardId.current, channelId.current);
    if (!syncing.current && item?.revision !== revision.current) {
      syncing.current = true;

      // stuff
      setChannel(item);

      if (curView === setView.current) {
        revision.current = item?.revision;
      }
      syncing.current = false;
      sync();
    }
  }

  const getCard = (guid) => {
    let contact = null
    card.state.cards.forEach((card, cardId, map) => {
      if (card?.profile?.guid === guid) {
        contact = card;
      }
    });
    return contact;
  }

  const getChannel = (cardId, channelId) => {
    if (cardId) {
      const entry = card.state.cards.get(cardId);
      return entry?.channels.get(channelId);
    }
    return channel.state.channels.get(channelId);
  }

  const setChannel = (item) => {
    let contacts = [];
    let logo = null;
    let subject = null;

    if (!item) {
      updateState({ contacts, logo, subject });
      return;
    }

    if (item.cardId) {
      contacts.push(card.state.cards.get(item.cardId));
    }
    if (item?.detail?.members) {
      const profileGuid = profile.state.profile.guid;
      item.detail.members.forEach(guid => {
        if (profileGuid !== guid) {
          const contact = getCard(guid);
          contacts.push(contact);
        }
      })
    }

    if (contacts.length === 0) {
      logo = 'solution';
    }
    else if (contacts.length === 1) {
      if (contacts[0]?.profile?.imageSet) {
        logo = card.actions.getCardLogo(contacts[0].cardId, contacts[0].profileRevision);
      }
      else {
        logo = 'avatar';
      }
    }
    else {
      logo = 'appstore';
    }

    if (item?.detail?.data) {
      try {
        subject = JSON.parse(item?.detail?.data).subject;
      }
      catch (err) {
        console.log(err);
      }
    }
    if (!subject) {
      if (contacts.length) {
        let names = [];
        for (let contact of contacts) {
          if (contact?.profile?.name) {
            names.push(contact.profile.name);
          }
          else if (contact?.profile?.handle) {
            names.push(contact?.profile?.handle);
          }
        }
        subject = names.join(', ');
      }
      else {
        subject = "Notes";
      }
    }

    updateState({ subject, logo, contacts });
  }

  useEffect(() => {
    sync();
  }, [card, channel]);

  const actions = {
    setChannel: (channel) => {
      if (channel.cardId !== cardId.current || channel.channelId !== channelId.current) {
        setView.current++;
        revision.current = 0;
        topics.current = new Map();
        channelId.current = channel.channelId;
        cardId.current = channel.cardId;
        sync();
      }
    },
  }

  return { state, actions }
}


