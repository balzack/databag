import { useState, useEffect, useContext } from 'react';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';
import { ProfileContext } from 'context/ProfileContext';
import moment from 'moment';

export function useBlockedTopics() {

  const [state, setState] = useState({
    channels: []
  });

  const profile = useContext(ProfileContext);
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);

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

  const setChannelItem = (item) => {
    let timestamp;
    const date = new Date(item.detail.created * 1000);
    const now = new Date();
    const offset = now.getTime() - date.getTime();
    if(offset < 86400000) {
      timestamp = moment(date).format('h:mma');
    }
    else if (offset < 31449600000) {
      timestamp = moment(date).format('M/DD');
    }
    else {
      timestamp = moment(date).format('M/DD/YYYY');
    }

    let contacts = [];
    if (item.cardId) {
      contacts.push(card.state.cards.get(item.cardId));
    }
    if (item?.detail?.members) {
      const profileGuid = profile.state.identity.guid;
      item.detail.members.forEach(guid => {
        if (profileGuid !== guid) {
          const contact = getCard(guid);
          contacts.push(contact);
        }
      })
    }

    let subject;
    if (item?.detail?.data) {
      try {
        topic = JSON.parse(item?.detail?.data).subject;
        subject = topic;
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

    return {
      id: `${item.cardId}:${item.channelId}`,
      cardId: item.cardId,
      channelId: item.channelId,
      name: subject,
      blocked: item.blocked,
      created: timestamp,
    }
  };

  useEffect(() => {
    let merged = [];
    card.state.cards.forEach((card, cardId, map) => {
      merged.push(...Array.from(card.channels.values()));
    });
    merged.push(...Array.from(channel.state.channels.values()));
    const items = merged.map(setChannelItem);
    const filtered = items.filter(item => item.blocked);
    updateState({ channels: filtered });
  }, [card, channel]);

  const actions = {
    unblock: async (cardId, channelId) => {
      if (cardId) {
        await card.actions.clearChannelBlocked(cardId, channelId);
      }
      else {
        await channel.actions.clearBlocked(channelId);
      } 
    }
  };

  return { state, actions };
}

