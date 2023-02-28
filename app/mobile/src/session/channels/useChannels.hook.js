import { useState, useRef, useEffect, useContext } from 'react';
import { ChannelContext } from 'context/ChannelContext';
import { CardContext } from 'context/CardContext';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';
import { ProfileContext } from 'context/ProfileContext';
import { getChannelSeals, isUnsealed, getContentKey, encryptChannelSubject, decryptChannelSubject, decryptTopicSubject } from 'context/sealUtil';
import { getCardByGuid } from 'context/cardUtil';

export function useChannels() {
  const [state, setState] = useState({
    filter: null,
    channels: [],
    adding: false,
    contacts: [],
    addMembers: [],
    addSubject: null,
    sealed: false,
    sealable: false,
    busy: false,
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
        if (item.unsealedDetail) {
          subject = item.unsealedDetail.subject;
        }
        else {
          try {
            const contentKey = await getContentKey(seals, account.state.sealKey);
            const unsealed = decryptChannelSubject(item.detail.data, contentKey);
            if (cardId) {
              await card.actions.setUnsealedChannelSubject(cardId, channelId, item.detailRevision, unsealed);
            }
            else {
              await channel.actions.setUnsealedChannelSubject(channelId, item.detailRevision, unsealed);
            }
          }
          catch(err) {
            console.log(err);
          }
        }
        if (item.summary.lastTopic.dataType === 'sealedtopic') {
          if (item.unsealedSummary) {
            message = item.unsealedSummary.message.text;
          }
          else {
            try {
              const contentKey = await getContentKey(seals, account.state.sealKey);
              const unsealed = decryptTopicSubject(item.summary.lastTopic.data, contentKey);
              if (cardId) {
                await card.actions.setUnsealedChannelSummary(cardId, channelId, item.topicRevision, unsealed);
              }
              else {
                await channel.actions.setUnsealedChannelSummary(channelId, item.topicRevision, unsealed);
              }
            }
            catch(err) {
              console.log(err);
            }
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
        contacts.push(getCardByGuid(card.state.cards, guid)?.card?.cardId);
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

    return { cardId, channelId, subject, message, logo, timestamp, updated, locked, unlocked };
  }

  useEffect(() => {
    const { status, sealKey } = account.state;
    if (status?.seal?.publicKey && sealKey?.public && sealKey?.private && sealKey?.public === status.seal.publicKey) {
      updateState({ sealable: true });
    }
    else {
      updateState({ sealed: false, sealable: false });
    }
  }, [account.state]);

  useEffect(() => {
    const contacts = [];
    card.state.cards.forEach(entry => {
      contacts.push(entry.card);
    });
    const filtered = contacts.filter(contact => {
      if (contact.detail.status !== 'connected') {
        return false;
      }
      if (state.sealed && !contact.profile.seal) {
        return false;
      }
      return true;
    });
    const sorted = filtered.sort((a, b) => {
      const aName = a?.profile?.name;
      const bName = b?.profile?.name;
      if (aName === bName) {
        return 0;
      }
      if (!aName || (aName < bName)) {
        return -1;
      }
      return 1;
    });
    const addMembers = state.addMembers.filter(item => sorted.some(contact => contact.cardId === item));
    updateState({ contacts: sorted, addMembers });
  }, [card.state, state.sealed]);

  useEffect(() => {
    syncChannels();
  }, [app.state, card.state, channel.state, state.filter]);

  const syncChannels = async () => {
    if (syncing.current) {
      resync.current = true;
    }
    else {
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
    setSealed: (sealed) => {
      updateState({ sealed });
    },
    setFilter: (filter) => {
      updateState({ filter });
    },
    showAdding: () => {
      updateState({ adding: true, addSubject: null, addMembers: [] });
    },
    hideAdding: () => {
      updateState({ adding: false });
    },
    setAddSubject: (addSubject) => {
      updateState({ addSubject });
    },
    setAddMember: (cardId) => {
      updateState({ addMembers: [ ...state.addMembers, cardId ] });
    },
    clearAddMember: (cardId) => {
      updateState({ addMembers: state.addMembers.filter(item => item !== cardId) });
    },
    addChannel: async () => {
      let conversation;
      if (!state.busy) {
        try {
          updateState({ busy: true });
          if (state.sealed) {
            const keys = [ account.state.sealKey.public ];
            state.addMembers.forEach(id => {
              const contact = card.state.cards.get(id);
              keys.push(contact.card.profile.seal);
            });
            const sealed = encryptChannelSubject(state.addSubject, keys);
            conversation = await channel.actions.addChannel('sealed', sealed, state.addMembers);
          }
          else {
            const subject = { subject: state.addSubject };
            conversation = await channel.actions.addChannel('superbasic', subject, state.addMembers);
          }
          updateState({ busy: false });
        }
        catch(err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error("failed to create new channel");
        }
      }
      else {
        throw new Error("operation in progress");
      }
      return conversation.id;
    },
  };

  return { state, actions };
}

