import { useState, useEffect, useContext } from 'react';
import { ChannelContext } from 'context/ChannelContext';
import { CardContext } from 'context/CardContext';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';
import { ProfileContext } from 'context/ProfileContext';
import { getChannelSeals, isUnsealed } from 'context/sealUtil';
import { getCardByGuid } from 'context/cardUtil';

export function useChannels() {
  const [state, setState] = useState({
    filter: null,
    channels: [],
  });

  const channel = useContext(ChannelContext);
  const card = useContext(CardContext);
  const account = useContext(AccountContext);
  const profile = useContext(ProfileContext);
  const app = useContext(AppContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const setChannelItem = (loginTimestamp, cardId, channelId, item) => {
    const timestamp = item.summary.lastTopic.created;
    const { readRevision, topicRevision } = item;
    
    // extract or decrypt subject
    let locked;
    let unlocked;
    let message;
    let subject;
    if (item.detail.dataType === 'sealed') {
      locked = true;
      const seals = getChannelSeals(item.detail.data);
      if (isUnsealed(seals, account.state.sealKey)) {
        unlocked = true;
        if (item.detail.unsealedDetail) {
          subject = item.detail.unsealedDetail.subject;
        }
        else {
          // decrypt detail
        }
        if (item.summary.lastTopic.dataType === 'sealedtopic') {
          if (item.summary.unsealedSummary) {
            message = item.detail.unsealedSummary.message;
          }
          else {
            // decrypt message
          }
        }
      }
    }
    if (item.detail.dataType === 'superbasic') {
      locked = false;
      unlocked = false;
      try {
        subject = JSON.parse(item.detail.data).subject;
      }
      catch(err) {
        console.log(err);
      }
      if (item.summary.lastTopic.dataType === 'superbasictopic') {
        try {
          message = JSON.parse(item.summary.lastTopic.data).text;
        }
        catch(err) {
          console.log(err);
        }
      }
    }

    const contacts = [];
    if (cardId) {
      contacts.push(cardId);
    }
    item.detail.members.forEach(guid => {
      if (guid !== profile.state.identity.guid) {
        contacts.push(getCardByGuid(card.state.cards, guid)?.cardId);
      }
    })

    if (!subject) {
      if (contacts.length === 0) {
        subject = 'Notes';
      }
      else {
        const names = [];
        contacts.forEach(id => {
          const contact = card.state.cards.get(id);
          if (contact?.card.profile?.name) {
            names.push(contact.card.profile.name);
          }
          else {
            names.push(contact?.card.profile?.handle);
          }
        });
        subject = names.join(', ');
      }
    }

    if (contacts.length === 0) {
      logo = 'solution';
    }
    else if (contacts.length === 1) {
      const contact = card.state.cards.get(contacts[0]);
      if (contact?.card?.profile?.imageSet) {
        logo = card.actions.getCardImageUrl(contacts[0])
      }
      else {
        logo = 'avatar';
      }
    }
    else {
      logo = 'appstore';
    }

    const updated = (loginTimestamp < timestamp) && (readRevision < topicRevision);

    return { cardId, channelId, subject, message, logo, updated, locked, unlocked };
  }

  useEffect(() => {
    const { loginTimestamp } = app.state;
    const channels = [];
    channel.state.channels.forEach((item, channelId) => {
      channels.push(setChannelItem(loginTimestamp, null, channelId, item));
    });
    card.state.cards.forEach((cardItem, cardId) => {
      cardItem.channels.forEach((channelItem, channelId) => {
        channels.push(setChannelItem(loginTimestamp, cardId, channelId, channelItem));
      });
    });
    const filtered = channels.filter(item => {
      if (!state.filter) {
        return true;
      }
      const filterCase = state.filter.toUpperCase();
      const subjectCase = item.subject.toUpperCase();
      return subjectCase.includes(filterCase);
    });
    const sorted = filtered.sort((a, b) => {
      const aCreated = a?.timestamp;
      const bCreated = b?.timestamp;
      if (aCreated === bCreated) {
        return 0;
      }
      if (!aCreated || aCreated < bCreated) {
        return 1;
      }
      return -1;
    });
    updateState({ channels: sorted });
  }, [app.state, card.state, channel.state, state.filter]);

  const actions = {
    setFilter: (filter) => {
      updateState({ filter });
    },
  };

  return { state, actions };
}

