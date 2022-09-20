import { useState, useEffect, useRef, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';
import { AppContext } from 'context/AppContext';
import config from 'constants/Config';

export function useChannels() {

  const [state, setState] = useState({
    topic: null,
    channels: []
  });

  const items = useRef([]);
  const channel = useContext(ChannelContext);
  const card = useContext(CardContext);
  const app = useContext(AppContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
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

  const setChannelEntry = (item) => {

    let updated = false;
    const login = app.state.loginTimestamp;
    const update = item?.summary?.lastTopic?.created;
    if (update && login && login < update) {
      if (!item.readRevision || item.readRevision < item.revision) {
        updated = true;
      }
    }

    let contacts = [];
    if (item?.detail?.members) {
      item.detail.members.forEach(guid => {
        contacts.push(getCard(guid));
      })
    }

    let logo = null;
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

    let subject = null;
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
          else {
            names.push(contact?.profile?.handle);
          }
        }
        subject = names.join(', ');
      }
      else {
        subject = "Notes";
      }
    }

    let message;
    if (item?.summary?.lastTopic?.dataType === 'superbasictopic') {
      try {
        message = JSON.parse(item.summary.lastTopic.data).text;
      }
      catch (err) {
        console.log(err);
      }
    }

    return { channelId: item.channelId, contacts, logo, subject, message, updated, revision: item.revision };
  }

  useEffect(() => {
    let channels = Array.from(channel.state.channels.values())
    channels.sort((a, b) => {
      const aCreated = a?.summary?.lastTopic?.created;
      const bCreated = b?.summary?.lastTopic?.created;
      if (aCreated === bCreated) {
        return 0;
      }
      if (!aCreated || aCreated < bCreated) {
        return 1;
      }
      return -1;
    });
    updateState({ channels: channels.map(item => setChannelEntry(item)) });
  }, [channel, card]);

  const actions = {
    setTopic: (topic) => {
      updateState({ topic });
    },
  };

  return { state, actions };
}

