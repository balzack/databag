import { useState, useRef, useEffect, useContext } from 'react';
import { ChannelContext } from 'context/ChannelContext';
import { CardContext } from 'context/CardContext';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';
import { ProfileContext } from 'context/ProfileContext';
import { getChannelSeals, isUnsealed, getContentKey, decryptChannelSubject } from 'context/sealUtil';
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

  const syncing = useRef(false);
  const resync = useRef(false);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const setChannelItem = async (loginTimestamp, cardId, channelId, item) => {
console.log('set channel item', cardId, channelId);

    const timestamp = item.summary.lastTopic.created;
    const { readRevision, topicRevision } = item;
    
    // extract or decrypt subject
    let locked;
    let unlocked;
    let message;
    let subject;
    if (item.detail.dataType === 'sealed') {
console.log("SEALED TYPE");
      locked = true;
console.log("CHECK1");
      const seals = getChannelSeals(item.detail.data);
console.log("CHECK2");
      if (isUnsealed(seals, account.state.sealKey)) {
console.log("CHECK3");
        unlocked = true;
        if (item.unsealedDetail) {
          subject = item.detail.unsealedDetail.subject;
        }
        else {
console.log("TRYING");
          try {
            const contentKey = await getContentKey(seals, account.state.sealKey);
            const unsealed = decryptChannelSubject(item.detail.data, contentKey);
            if (cardId) {
              await card.actions.setUnsealedChannelSubject(cardId, channelId, item.revision, unsealed);
            }
            else {
              await channel.actions.setUnsealedChannelSubject(channelId, item.detailRevision, unsealed);
            }
            subject = unsealed.subject;
          }
          catch(err) {
            console.log(err);
          }
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
    syncChannels();
  }, [app.state, card.state, channel.state, state.filter]);

  const syncChannels = async () => {
    if (!syncing.current) {
      syncing.current = true;

      const { loginTimestamp } = app.state;
      const items = [];
      channel.state.channels.forEach((item, channelId) => {
        items.push({ loginTimestamp, channelId, channelItem: item });
      });
      card.state.cards.forEach((cardItem, cardId) => {
        cardItem.channels.forEach((channelItem, channelId) => {
          items.push({ loginTimestamp, cardId, channelId, channelItem });
        });
      });
      const channels = [];
      for (let i = 0; i < items.length; i++) {
        const { loginTimestamp, cardId, channelId, channelItem } = items[i];
        channels.push(await setChannelItem(loginTimestamp, cardId, channelId, channelItem));
      }
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

      syncing.current = false;
      if(resync.current) {
        resync.current = false;
        await syncChannels();
      }
    }
  };

  const actions = {
    setFilter: (filter) => {
      updateState({ filter });
    },
  };

  return { state, actions };
}

