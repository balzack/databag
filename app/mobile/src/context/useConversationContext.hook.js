import { useState, useEffect, useRef, useContext } from 'react';
import { StoreContext } from 'context/StoreContext';
import { UploadContext } from 'context/UploadContext';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';
import { ProfileContext } from 'context/ProfileContext';
import moment from 'moment';
import CryptoJS from 'crypto-js';

export function useConversationContext() {
  const [state, setState] = useState({
    topic: null,
    subject: null,
    logo: null,
    revision: null,
    contacts: [],
    topics: new Map(),
    created: null,
    host: null,
    init: false,
    progress: null,
    cardId: null,
    channelId: null,
    pushEnabled: null,
    locked: false,
    unlocked: false,
    seals: null,
  });
  const store = useContext(StoreContext);
  const upload = useContext(UploadContext);
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const profile = useContext(ProfileContext);
  const topics = useRef(null);
  const revision = useRef(0);
  const force = useRef(false);
  const detailRevision = useRef(0);
  const syncing = useRef(false);
  const conversationId = useRef(null);
  const reset = useRef(false);
  const setView = useRef(0);
  const transfer = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const { cardId, channelId } = state;
    const key = cardId ? `${cardId}:${channelId}` : `:${channelId}`
    const progress = upload.state.progress.get(key);
    if (progress) {
      let count = 0;
      let complete = 0;
      let active = 0;
      let loaded = 0;
      let total = 0;
      let error = false;
      progress.forEach(post => {
        count += post.count;
        complete += (post.index - 1);
        if (post.active) {
          active += 1;
          loaded += post.active.loaded;
          total += post.active.total;
        }
        if (post.error) {
          error = true;
        }
      });
      percent = Math.floor(((((loaded / total) * active) + complete) / count) * 100);
      if (transfer.current == null || error || Math.abs(transfer.current - percent) > 5) {
        updateState({ progress: percent, uploadError: error });
        transfer.current = percent;
      }

      if (error) {
        setTimeout(() => {
          upload.actions.clearErrors(cardId, channelId);
          updateState({ progress: null, uploadError: false });
          transfer.current = null;
        }, 2000);
      }
    }
    else {
      updateState({ progress: null });
      transfer.current = null;
    }
  }, [upload, state.cardId, state.channelId]);

  const getTopicItems = async (cardId, channelId) => {
    if (cardId) {
      return await card.actions.getChannelTopicItems(cardId, channelId);
    }
    return await channel.actions.getTopicItems(channelId);
  }
  const setTopicItem = async (cardId, channelId, topic) => {
    if (cardId) {
      return await card.actions.setChannelTopicItem(cardId, channelId, topic);
    }
    return await channel.actions.setTopicItem(channelId, topic);
  }
  const clearTopicItem = async (cardId, channelId, topicId) => {
    if (cardId) {
      return await card.actions.clearChannelTopicItem(cardId, channelId, topicId);
    }
    return await channel.actions.clearTopicItem(channelId, topicId);
  }
  const getTopic = async (cardId, channelId, topicId) => {
    if (cardId) {
      return await card.actions.getChannelTopic(cardId, channelId, topicId);
    }
    return await channel.actions.getTopic(channelId, topicId);
  }
  const getTopics = async (cardId, channelId, revision) => {
    if (cardId) {
      return await card.actions.getChannelTopics(cardId, channelId, revision);
    }
    return await channel.actions.getTopics(channelId, revision)
  }
  const getTopicAssetUrl = (cardId, channelId, assetId) => {
    if (cardId) {
      return card.actions.getChannelTopicAssetUrl(cardId, channelId, topicId, assetId);
    }
    return channel.actions.getTopicAssetUrl(channelId, assetId);
  }
  const addTopic = async (cardId, channelId, message, asssets) => {
    if (cardId) {
      return await card.actions.addChannelTopic(cardId, channelId, message, assetId);
    }
    return await channel.actions.addTopic(channelId, message, assetId);
  }
  const setTopicSubject = async (cardId, channelId, topicId, dataType, data) => {
    if (cardId) {
      return await card.actions.setChannelTopicSubject(cardId, channelId, topicId, dataType, data);
    }
    return await channel.actions.setTopicSubject(channelId, topicId, dataType, data);
  }
  const remove = async (cardId, channelId) => {
    if (cardId) {
      return await card.actions.removeChannel(cardId, channelId);
    }
    return await channel.actions.remove(channelId);
  }
  const removeTopic = async (cardId, channelId, topicId) => {
    if (cardId) {
      return await card.actions.removeChannelTopic(cardId, channelId, topicId);
    }
    return await channel.actions.removeTopic(channelId, topicId);
  }
  const setNotifications = async (cardId, channelId, notify) => {
    if (cardId) {
      return await card.actions.setChannelNotifications(cardId, channelId, notify);
    }
    return await channel.actions.setNotifications(channelId, notify);
  }
  const getNotifications = async (cardId, channelId) => {
    if (cardId) {
      return await card.actions.getChannelNotifications(cardId, channelId);
    }
    return await channel.actions.getNotifications(channelId);
  }
  const setSyncRevision = async (cardId, channelId, revision) => {
    if (cardId) {
      return await card.actions.setSyncRevision(cardId, channelId, revision);
    }
    return await channel.actions.setSyncRevision(channelId, revision);
  }

  useEffect(() => {
    if (conversationId.current) {
      const { cardId, channelId } = conversationId.current;
      const channelItem = getChannel(cardId, channelId);
      setChannel(channelItem);
    }
  }, [card, channel]);

  const sync = async () => {
    const curView = setView.current;
    if (!syncing.current) {
      if (reset.current) {
        revision.current = null;
        detailRevision.current = null;
        topics.current = null;
        reset.current = false;
      }
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        const channelItem = getChannel(cardId, channelId);
        if (channelItem && (channelItem.revision !== revision.current || force.current)) {
          syncing.current = true;

          try {
            // set channel details
            if (detailRevision.current != channelItem.detailRevision) {
              if (curView === setView.current) {
                await setChannel(channelItem);
                detailRevision.current = channelItem.detailRevision;
              }
            }

            // initial load from store
            if (!topics.current) {
              topics.current = new Map();
              const items = await getTopicItems(cardId, channelId);
              items.forEach(item => {
                topics.current.set(item.topicId, item);
              });
            }

            // sync from server
            if (channelItem.topicRevision != channelItem.syncRevision || force.current) {
              force.current = false;
              const res = await getTopics(cardId, channelId, channelItem.syncRevision)
              for (const topic of res.topics) {
                if (!topic.data) {
                  topics.current.delete(topic.id);
                  await clearTopicItem(cardId, channelId, topic.id);
                }
                else {
                  const cached = topics.current.get(topic.id);
                  if (!cached || cached.detailRevision != topic.data.detailRevision) {
                    if (!topic.data.topicDetail) {
                      const updated = await getTopic(cardId, channelId, topic.id);
                      topic.data = updated.data;
                    }
                    if (!topic.data) {
                      topics.current.delete(topic.id);
                      await clearTopicItem(cardId, channelId, topic.id);
                    }
                    else {
                      await setTopicItem(cardId, channelId, topic);
                      const { id, revision, data } = topic;
                      topics.current.set(id, { topicId: id, revision: revision, detailRevision: topic.data.detailRevision, detail: topic.data.topicDetail }); 
                    }
                  }
                }
              }
              await setSyncRevision(cardId, channelId, res.revision);
            }

            // update revision
            revision.current = channelItem.revision;
            if (curView == setView.current) {
              if (cardId) {
                card.actions.setChannelReadRevision(cardId, channelId, revision.current);
              }
              else {
                channel.actions.setReadRevision(channelId, revision.current);
              }
              updateState({ topics: topics.current, init: true, error: false });
            }

            syncing.current = false;
            sync();
          }
          catch(err) {
            console.log(err);
            syncing.current = false;
            updateState({ error: true });
          }
        }
      }
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

  const setChannel = async (item) => {
    let contacts = [];
    let logo = null;
    let topic = null;
    let subject = null;
    let locked = false;
    let unlocked = false;
    let seals = null;

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

    if (!item) {
      updateState({ contacts, logo, subject, topic });
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

    if (item?.detail?.dataType === 'sealed') {
      locked = true;
      unlocked = item.unsealedDetail != null;
      if (item.unsealedDetail?.subject) {
        topic = item.unsealedDetail.subject;
        subject = topic;
      }
      try {
        seals = JSON.parse(item.detail.data).seals;
      }
      catch (err) {
        console.log(err);
      }
    }
    else {
      if (item?.detail?.data) {
        try {
          topic = JSON.parse(item?.detail?.data).subject;
          subject = topic;
        }
        catch (err) {
          console.log(err);
        }
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

    const pushEnabled = await getNotifications(item.cardId, item.channelId);

    const { enableImage, enableAudio, enableVideo } = item.detail;
    updateState({ topic, subject, logo, contacts, host: item.cardId, created: timestamp,
      enableImage, enableAudio, enableVideo, pushEnabled, locked, unlocked, seals });
  }

  useEffect(() => {
    sync();
  }, [card, channel]);

  const actions = {
    setChannel: (selected) => {
      if (selected == null) {
        setView.current++;
        conversationId.current = null;
        reset.current = true;
        updateState({ subject: null, logo: null, contacts: [], topics: new Map() });
      }
      else if (selected.cardId !== conversationId.current?.cardId || selected.channelId !== conversationId.current?.channelId) {
        setView.current++;
        conversationId.current = selected;
        reset.current = true;
        updateState({ subject: null, logo: null, contacts: [], topics: new Map(), init: false,
            cardId: selected.cardId, channelId: selected.channelId });
        sync();
        const { cardId, channelId, revision } = selected;
        if (cardId) {
          card.actions.setChannelReadRevision(cardId, channelId, revision);
        }
        else {
          channel.actions.setReadRevision(channelId, revision);
        }
      }
    },
    getTopicAssetUrl: (topicId, assetId) => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        if (cardId) {
          return card.actions.getChannelTopicAssetUrl(cardId, channelId, topicId, assetId);
        }
        else {
          return channel.actions.getTopicAssetUrl(channelId, topicId, assetId);
        }
      }
      return null;
    },
    addTopic: async (message, files) => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        if (cardId) {
          await card.actions.addChannelTopic(cardId, channelId, message, files);
        }
        else {
          await channel.actions.addTopic(channelId, message, files);
        }
        force.current = true;
        sync();
      }
    },
    addSealedTopic: async (message, sealKey) => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        if (cardId) {
          await card.actions.addSealedChannelTopic(cardId, channelId,  message, sealKey);
        }
        else {
          await channel.actions.addSealedTopic(channelId, message, sealKey);
        }
        force.current = true;
        sync();
      }
    },
    unsealTopic: async (topicId, sealKey) => {
      try {
        const topic = topics.current.get(topicId);
        const { messageEncrypted, messageIv } = JSON.parse(topic.detail.data);
        const iv = CryptoJS.enc.Hex.parse(messageIv);
        const key = CryptoJS.enc.Hex.parse(sealKey);
        const enc = CryptoJS.enc.Base64.parse(messageEncrypted);
        let cipher = CryptoJS.lib.CipherParams.create({ ciphertext: enc, iv: iv });
        const dec = CryptoJS.AES.decrypt(cipher, key, { iv: iv });
        topic.unsealedDetail = JSON.parse(dec.toString(CryptoJS.enc.Utf8));
        topics.current.set(topicId, { ...topic });
        updateState({ topics: topics.current });
    
        const { cardId, channelId } = conversationId.current;
        if (cardId) {
          await card.actions.setChannelTopicUnsealedDetail(cardId, channelId, topic.topicId, topic.detailRevision, topic.unsealedDetial);
        }
        else {
          await channel.actions.setTopicUnsealedDetail(channelId, topic.topicId, topic.detailRevision, topic.unsealedDetail);
        }
      }
      catch(err) {
        console.log(err);
      }
    },
    setSubject: async (subject) => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        if (cardId) {
          throw new Error("can only set hosted channel subjects");
        }
        await channel.actions.setSubject(channelId, subject);
      }
    },
    setSealedSubject: async (subject, sealKey) => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        if (cardId) {
          throw new Error("can only set hosted channel subjects");
        }
        await channel.actions.setSealedSubject(channelId, subject, sealKey);
      }
    },
    remove: async () => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        await remove(cardId, channelId);
      }
    },
    setNotifications: async (notify) => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        await setNotifications(cardId, channelId, notify);
        updateState({ pushEnabled: notify });
      }
    },
    removeTopic: async (topicId) => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        if (cardId) {
          await card.actions.removeChannelTopic(cardId, channelId, topicId);
        }
        else {
          await channel.actions.removeTopic(channelId, topicId);
        }
        force.current = true;
        sync();
      }
    },
    setTopicSubject: async (topicId, data) => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        if (cardId) {
          return await card.actions.setChannelTopicSubject(cardId, channelId, topicId, 'superbasictopic', data);
        }
        else {
          return await channel.actions.setTopicSubject(channelId, topicId, 'superbasictopic', data);
        }
      }
      force.current = true;
      sync();
    },
    setSealedTopicSubject: async (topicId, data, sealKey) => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;

        const iv = CryptoJS.lib.WordArray.random(128 / 8);
        const key = CryptoJS.enc.Hex.parse(sealKey);
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ message: data }), key, { iv: iv });
        const messageEncrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
        const messageIv = iv.toString();

        if (cardId) {
          return await card.actions.setChannelTopicSubject(cardId, channelId, topicId, 'sealedtopic', { messageEncrypted, messageIv });
        }
        else {
          return await channel.actions.setTopicSubject(channelId, topicId, 'sealedtopic', { messageEncrypted, messageIv });
        }
 
      }
    },
    setCard: async (id) => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        if (cardId) {
          throw new Error("can only set members on hosted channel");
        }
        await channel.actions.setCard(channelId, id);
      }
    },
    clearCard: async (id) => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        if (cardId) {
          throw new Error("can only clear members on hosted channel");
        }
        await channel.actions.clearCard(channelId, id);
      }
    },
    addReport: async () => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        if (cardId) {
          return await card.actions.addChannelReport(cardId, channelId);
        }
        else {
          return await channel.actions.addReport(channelId);
        }
      }
    },
    addTopicReport: async(topicId) => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        if (cardId) {
          return await card.actions.addChannelTopicReport(cardId, channelId, topicId);
        }
        else {
          return await channel.actions.addTopicReport(channelId, topicId);
        }
      }
    },
    setBlocked: async () => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        if (cardId) {
          await card.actions.setChannelBlocked(cardId, channelId);
        }
        else {
          await channel.actions.setBlocked(channelId);
        }
      }
    },
    blockTopic: async (topicId) => {
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        if (cardId) {
          await card.actions.setChannelTopicBlocked(cardId, channelId, topicId);
        }
        else {
          await channel.actions.setTopicBlocked(channelId, topicId);
        }
        const topic = topics.current.get(topicId);
        if (topic) {
          topic.blocked = 1;
          force.current = true;
          sync();
        }
      }
    },
    unblockTopic: async (cardId, channelId, topicId) => {
      if (conversationId.current) {
        if (conversationId.current.cardId == cardId && conversationId.current.channelId == channelId) {
          const topic = topics.current.get(topicId);
          if (topic) {
            topic.blocked = 0;
            force.current = true;
            sync();
          }
        }
      }
    },
    resync: () => {
      if (conversationId.current) {
        force.current = true;
        sync();
      }
    },
  }

  return { state, actions }
}


