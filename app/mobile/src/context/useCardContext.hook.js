import { useState, useRef, useContext } from 'react';
import { StoreContext } from 'context/StoreContext';
import { UploadContext } from 'context/UploadContext';
import { addFlag } from 'api/addFlag';
import { getCard } from 'api/getCard';
import { getCards } from 'api/getCards';
import { getCardProfile } from 'api/getCardProfile';
import { setCardProfile } from 'api/setCardProfile';
import { getCardDetail } from 'api/getCardDetail';
import { getContactProfile } from 'api/getContactProfile';
import { getContactChannels } from 'api/getContactChannels';
import { getContactChannelDetail } from 'api/getContactChannelDetail';
import { getContactChannelSummary } from 'api/getContactChannelSummary';
import { getCardImageUrl } from 'api/getCardImageUrl';
import { addCard } from 'api/addCard';
import { removeCard } from 'api/removeCard';
import { setCardConnecting, setCardConnected, setCardConfirmed } from 'api/setCardStatus';
import { getCardOpenMessage } from 'api/getCardOpenMessage';
import { setCardOpenMessage } from 'api/setCardOpenMessage';
import { getCardCloseMessage } from 'api/getCardCloseMessage';
import { setCardCloseMessage } from 'api/setCardCloseMessage';
import { getContactChannelTopic } from 'api/getContactChannelTopic';
import { getContactChannelTopics } from 'api/getContactChannelTopics';
import { getContactChannelTopicAssetUrl } from 'api/getContactChannelTopicAssetUrl';
import { addContactChannelTopic } from 'api/addContactChannelTopic';
import { setContactChannelTopicSubject } from 'api/setContactChannelTopicSubject';
import { removeContactChannel } from 'api/removeContactChannel';
import { removeContactChannelTopic } from 'api/removeContactChannelTopic';
import { getContactChannelNotifications } from 'api/getContactChannelNotifications';
import { setContactChannelNotifications } from 'api/setContactChannelNotifications';

export function useCardContext() {
  const [state, setState] = useState({
    offsync: false,
    cards: new Map(),
    viewRevision: null,
  });
  const upload = useContext(UploadContext);
  const access = useRef(null);
  const setRevision = useRef(null);
  const curRevision = useRef(null);
  const cards = useRef(new Map());
  const syncing = useRef(false);
  const store = useContext(StoreContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const setCardItem = (card) => {
    return {
      cardId: card.id,
      revision: card.revision,
      detailRevision: card.data?.detailRevision,
      profileRevision: card.data?.profileRevision,
      detail: card.data?.cardDetail,
      profile: card.data?.cardProfile,
      notifiedView: card.data?.notifiedView,
      notifiedProfile: card.data?.notifiedProfile,
      notifiedArticle: card.data?.notifiedArticle,
      notifiedChannel: card.data?.notifiedChannel,
    }
  }

  const setCardField = (cardId, field, value) => {
    const card = cards.current.get(cardId);
    if (card) {
      card[field] = value;
      cards.current.set(cardId, { ...card });
      updateState({ cards: cards.current });
    }
  };

  const setCardChannelItem = (cardChannel) => {
    return {
      channelId: cardChannel.id,
      revision: cardChannel.revision,
      detailRevision: cardChannel.data.detailRevision,
      topicRevision: cardChannel.data.topicRevision,
      detail: cardChannel.data.channelDetail,
      summary: cardChannel.data.channelSummary,
    };
  };

  const setCardChannelField = (cardId, channelId, field, value, field2, value2) => {
    const card = cards.current.get(cardId);
    if (card) {
      const channel = card.channels.get(channelId);
      if (channel) {
        channel[field] = value;
        if(field2) {
          channel[field2] = value2;
        }
        card.channels.set(channelId, { ...channel });
        cards.current.set(cardId, { ...card });
        updateState({ cards: cards.current });
      }
    }
  };
  
  const resyncCard = async (cardId) => {
    if (!syncing.current) {
      syncing.current = true;

      try {
        const { server, token, guid } = access.current || {};
        const entry = cards.current.get(cardId);
        if (entry?.card?.detail.status === 'connected') {
          const card = await getCard(server, token, cardId);
          const { notifiedView, notifiedProfile, notifiedArticle, notifiedChannel } = card.data || {};
          const cardRevision = { view: notifiedView, profile: notifiedProfile, artcile: notifiedArticle, channel: notifiedChannel };
          await syncCard(server, token, guid, entry, cardRevision);
          await store.action.clearCardItemOffsync(guid, cardId);
          entry.card.offsync = false;
        }
        
        cards.current.set(cardId, card);
        updateState({ cards: cards.current });
      }
      catch(err) {
        console.log(err);
      }
      syncing.current = false;
      await sync();
    }
  }

  const sync = async () => {
    if (access.current && !syncing.current && setRevision.current !== curRevision.current) {
      syncing.current = true;
      try {
        const { server, token, guid } = access.current || {};
        const revision = curRevision.current;
        const delta = await getCards(server, token, setRevision.current);
        for (let card of delta) {
          if (card.data) {
            const item = setCardItem(card);
            const entry = cards.current.get(card.id) || { channels: new Map() };
            if (!entry.card) {
              const { cardId, detailRevision, profileRevision } = item;
              const entryCard = { cardId, detailRevision, profileRevision };
              if (item.detail) {
                entryCard.detail = item.detail;
              }
              else {
                entryCard.detail = await getCardDetail(server, token, card.id);
              }
              if (item.profile) {
                entryCard.profile = item.profile;
              }
              else {
                entryCard.profile = await getCardProfile(server, token, card.id);
              }
              await store.actions.setCardItem(guid, entryCard);
              entry.card = entryCard;
              cards.current.set(card.id, entry);
            }
            else {
              const { profileRevision, detailRevision } = entry.card; 
              if (item.profileRevision !== profileRevision) {
                if (item.profile) {
                  entry.card.profile = item.profile;
                }
                else {
                  entry.card.profile = await getCardProfile(server, token, card.id);
                }
                entry.card.profileRevision = item.profileRevision;
                await store.actions.setCardItemProfile(guid, card.id, entry.card.profileRevision, entry.card.profile);
              }
              if (item.detailRevision !== detailRevision) {
                if (item.detail) {
                  entry.card.detail = item.detail;
                }
                else {
                  entry.card.detail = await getCardDetail(server, token, card.id);
                }
                entry.card.detailRevision = item.detailRevision;
                await store.actions.setCardItemDetail(guid, card.id, entry.card.detailRevision, entry.card.detail);
              }
            }
            if (entry.card.detail?.status === 'connected' && !entry.card.offsync) {
              try {
                const { notifiedView, notifiedProfile, notifiedArticle, notifiedChannel } = item;
                const cardRevision = { view: notifiedView, profile: notifiedProfile, article: notifiedArticle, channel: notifiedChannel };
                await syncCard(server, token, guid, entry, cardRevision);
              }
              catch (err) {
                console.log(err);
                entry.offsync = true;
                await store.actions.setCardItemOffsync(guid, card.id);
              }
            }
            cards.current.set(card.id, { ...entry }); 
          }
          else {
            const entry = cards.current.get(card.id) || { card: {}, channels: new Map() };
            const ids = [];
            entry.channels.forEach((value, key) => {
              ids.push(key);
            });
            for (let i = 0; i < ids.length; i++) {
              await store.actions.clearCardChannelTopicItems(guid, card.id, ids[i]);
            }
            await store.actions.clearCardChannelItems(guid, card.id); 
            await store.actions.clearCardItem(guid, card.id);
            cards.current.delete(card.id);
          }
        }
        setRevision.current = revision;
        await store.actions.setCardRevision(guid, revision);
        updateState({ offsync: false, cards: cards.current });
      }
      catch (err) {
        console.log(err);
        syncing.current = false;
        updateState({ offsync: true });
        return;
      }

      syncing.current = false;
      await sync();
    }
  };

  const syncCard = async (server, token, guid, entry, cardRevision) => {

    const { detail, profile, cardId } = entry.card;
    const { notifiedView, notifiedProfile, notifiedArticle, notifiedChannel } = entry.card;
    const cardServer = profile?.node;
    const cardToken = `${profile?.guid}.${detail?.token}`;

    if (entry.card.notifiedProfile !== cardRevision.profile) {
      if (entry.card.profileRevision !== cardRevision.profile) {
        const message = await getContactProfile(cardServer, cardToken);
        await setCardProfile(server, token, cardId, message);
      }
      entry.card.notifiedProfile = cardRevision.profile;
      store.actions.setCardItemNotifiedProfile(guid, cardId, cardRevision.profile);
    }

    if (entry.card.notifiedView !== cardRevision.view || entry.card.notifiedChannel !== cardRevision.channel) {
      const view = cardRevision.view === entry.card.notifiedView ? entry.card.notifiedView : null;
      const channel = cardRevision.view === entry.card.notifiedView ? entry.card.notifiedChannel : null;
      const delta = await getContactChannels(cardServer, cardToken, view, channel);
      for (let channel of delta) {
        if (channel.data) {
          const channelItem = setCardChannelItem(channel);
          const channelEntry = entry.channels.get(channel.id);
          if (!channelEntry) {
            if (!channelItem.detail) {
              channelItem.detail = await getContactChannelDetail(cardServer, cardToken, channel.id);
            }
            if (!channelItem.summary) {
              channelItem.summary = await getContactChannelSummary(cardServer, cardToken, channel.id);
            }
            await store.actions.setCardChannelItem(guid, cardId, channelItem);
            entry.channels.set(channel.id, { ...channelItem });
          }
          else {
            if (channelItem.detailRevision !== channelEntry.detailRevision) {
              if (channelItem.detail) {
                channelEntry.detail = channelItem.detail;
              }
              else {
                channelEntry.detail = await getContactChannelDetail(cardServer, cardToken, channel.id);
              }
              channelEntry.unsealedDetail = null;
              channelEntry.detailRevision = channelItem.detailRevision;
              await store.actions.setCardChannelItemDetail(guid, cardId, channel.id, channelEntry.detailRevision, channelEntry.detail);
            }
            if (channelItem.topicRevision !== channelEntry.topicRevision) {
              if (channelItem.summary) {
                channelEntry.summary = channelItem.summary;
              }
              else {
                channelEntry.summary = await getContactChannelSummary(cardServer, cardToken, channel.id);
              }
              channelEntry.unsealedSummary = null;
              channelEntry.topicRevision = channelItem.topicRevision;
              await store.actions.setCardChannelItemSummary(guid, cardId, channel.id, channelEntry.topicRevision, channelEntry.summary);
            }
            entry.channels.set(channel.id, { ...channelEntry });
          }
        }
        else {
          await store.actions.clearCardChannelTopicItems(guid, cardId, channel.id);
          await store.actions.clearCardChannelItem(guid, cardId, channel.id);
          entry.channels.delete(channel.id);
        }
      }
      entry.card.notifiedChannel = cardRevision.channel;
      await store.actions.setCardItemNotifiedChannel(guid, cardId, cardRevision.channel);
      entry.card.notifiedView = cardRevision.view;
      await store.actions.setCardItemNotifiedView(guid, cardId, cardRevision.view);
    }
  };

  const actions = {
    setSession: async (session) => {
      if (access.current || syncing.current) {
        throw new Error('invalid card state');
      }
      access.current = session;
      cards.current = new Map();
      const cardItems = await store.actions.getCardItems(session.guid);
      for(card of cardItems) {
        const entry = { card, channels: new Map() };
        const cardChannelItems = await store.actions.getCardChannelItems(session.guid, card.cardId);
        for (cardChannel of cardChannelItems) {
          entry.channels.set(cardChannel.channelId, cardChannel);
        }
        cards.current.set(card.cardId, entry);
      }
      const status = await store.actions.getCardRequestStatus(session.guid);
      const revision = await store.actions.getCardRevision(session.guid);
      curRevision.current = revision;
      setRevision.current = revision;
      setState({ offsync: false, viewRevision: status?.revision, cards: cards.current });
    },
    clearSession: () => {
      access.current = null;
    },
    setRevision: (revision) => {
      curRevision.current = revision;
      sync();
    },
    addCard: async (message) => {
      const { server, token } = access.current || {};
      return await addCard(server, token, message);
    },
    removeCard: async (cardId) => {
      const { server, token } = access.current || {};
      return await removeCard(server, token, cardId);
    },
    setCardConnecting: async (cardId) => {
      const { server, token } = access.current || {};
      return await setCardConnecting(server, token, cardId);
    },
    setCardConnected: async (cardId, cardToken, revision) => {
      const { server, token } = access.current || {};
      return await setCardConnected(server, token, cardId, cardToken,
          revision.viewRevision, revision.articleRevision,
          revision.channelRevision, revision.profileRevision);
    },
    setCardConfirmed: async (cardId) => {
      const { server, token } = access.current || {};
      return await setCardConfirmed(server, token, cardId);
    },
    getCardOpenMessage: async (cardId) => {
      const { server, token } = access.current || {};
      return await getCardOpenMessage(server, token, cardId);
    },
    setCardOpenMessage: async (server, message) => {
      return await setCardOpenMessage(server, message);
    },
    getCardCloseMessage: async (cardId) => {
      const { server, token } = access.current || {};
      return await getCardCloseMessage(server, token, cardId);
    },
    setCardCloseMessage: async (server, message) => {
      return await setCardCloseMessage(server, message);
    },
    getCardImageUrl: (cardId) => {
      const { profileRevision } = cards.current.get(cardId)?.card || {};
      const { server, token } = access.current || {};
      return getCardImageUrl(server, token, cardId, profileRevision);
    },
    removeChannel: async (cardId, channelId) => {
      const { detail, profile } = cards.current.get(cardId)?.card || {};
      const cardToken = `${profile?.guid}.${detail?.token}`;
      return await removeContactChannel(profile?.node, cardToken, channelId);
    },
    addTopic: async (cardId, channelId, type, message, files) => {
      const { detail, profile } = cards.current.get(cardId)?.card || {};
      const cardToken = `${profile?.guid}.${detail?.token}`;
      const node = profile?.node;
      if (files?.length > 0) {
        const topicId = await addContactChannelTopic(node, cardToken, channelId, null, null, null);
        upload.actions.addTopic(node, cardToken, channelId, topicId, files, async (assets) => {
          const subject = message(assets);
          await setContactChannelTopicSubject(node, cardToken, channelId, topicId, type, subject);
        }, async () => {
          try {
            await removeContactChannelTopic(node, cardToken, channelId, topicId);
          }
          catch (err) {
            console.log(err);
          }
        }, cardId);
      }
      else {
        const subject = message([]);
        await addContactChannelTopic(node, cardToken, channelId, type, subject, []);
      }
    },
    removeTopic: async (cardId, channelId, topicId) => {
      const { detail, profile } = (cards.current.get(cardId) || {}).card;
      const cardToken = `${profile?.guid}.${detail?.token}`;
      return await removeContactChannelTopic(profile?.node, cardToken, channelId, topicId);
    },
    setTopicSubject: async (cardId, channelId, topicId, type, subject) => {
      const { detail, profile } = (cards.current.get(cardId) || {}).card;
      const cardToken = `${profile?.guid}.${detail?.token}`;
      return await setContactChannelTopicSubject(profile?.node, cardToken, channelId, topicId, type, subject);
    },
    getTopicAssetUrl: (cardId, channelId, topicId, assetId) => {
      const { detail, profile } = (cards.current.get(cardId) || {}).card;
      const cardToken = `${profile?.guid}.${detail?.token}`;
      return getContactChannelTopicAssetUrl(profile?.node, cardToken, channelId, topicId, assetId);
    },
    getTopics: async (cardId, channelId, revision, count, begin, end) => {
      const { detail, profile } = (cards.current.get(cardId) || {}).card;
      const cardToken = `${profile?.guid}.${detail?.token}`;
      return await getContactChannelTopics(profile?.node, cardToken, channelId, revision, count, begin, end);
    },
    getTopic: async (cardId, channelId, topicId) => {
      const { detail, profile } = (cards.current.get(cardId) || {}).card;
      const cardToken = `${profile?.guid}.${detail?.token}`;
      return await getContactChannelTopic(profile?.node, cardToken, channelId, topicId);
    },
    setContactRevision: async (cardId, revision) => {
      const { guid } = acccess.current || {};
      await store.actions.setCardRequestStatus(guid, { revision });
      updateState({ viewRevision: revision });
    },
    setChannelReadRevision: async (cardId, channelId, revision) => {
      const { guid } = access.current || {};
      await store.actions.setCardChannelItemReadRevision(guid, cardId, channelId, revision);
      setCardChannelField(cardId, channelId, 'readRevision', revision);
    },
    setChannelSyncRevision: async (cardId, channelId, revision) => {
      const { guid } = access.current || {};
      await store.actions.setCardChannelItemSyncRevision(guid, cardId, channelId, revision);
      setCardChannelField(cardId, channelId, 'syncRevision', revision);
    },
    setChannelTopicMarker: async (cardId, channelId, marker) => {
      const { guid } = access.current || {};
      await store.actions.setCardChannelItemTopicMarker(guid, cardId, channelId, marker);
      setCardChannelField(cardId, channelId, 'topicMarker', marker);
    },
    setChannelMarkerAndSync: async (cardId, channelId, marker, revision) => {
      const { guid } = access.current || {};
      await store.actions.setCardChannelItemMarkerAndSync(guid, cardId, channelId, marker, revision);
      setCardChannelField(cardId, channelId, 'topicMarker', marker, 'syncRevision', revision);
    },
    setCardFlag: async (cardId) => {
      const { guid } = acccess.current || {};
      await store.actions.setCardItemBlocked(guid, cardId);
      setCardField(cardId, 'blocked', true);
    },
    clearCardFlag: async (cardId) => {
      const { guid } = acccess.current || {};
      await store.actions.clearCardItemBlocked(guid, cardId);
      setCardField(cardId, 'blocked', false);
    },
    setChannelFlag: async (cardId, channelId) => {
      const { guid } = access.current || {};
      await store.actions.setCardChannelItemBlocked(guid, cardId, channelId);
      setCardChannelField(cardId, channelId, 'blocked', true);
    },
    clearChannelFlag: async (cardId, channelId) => {
      const { guid } = access.current || {};
      await store.actions.setCardChannelItemBlocked(guid, cardId, channelId);
      setCardChannelField(cardId, channelId, 'blocked', false);
    },
    setTopicFlag: async (cardId, channelId, topicId) => {
      const { guid } = access.current || {};
      await store.actions.setCardChannelTopicBlocked(guid, cardId, channelId, topicId, true);
    },
    clearTopicFlag: async (cardId, channelId, topicId) => {
      const { guid } = access.current;
      await store.actions.setCardChannelTopicBlocked(guid, cardId, channelId, topicId, false);
    },
    addChannelAlert: async (cardId, channelId) => {
      const { detail, profile } = (cards.current.get(cardId) || {}).card;
      return await addFlag(profile?.node, profile?.guid, channelId);
    },
    addTopicAlert: async (cardId, channelId, topicId) => {
      const { detail, profile } = (cards.current.get(cardId) || {}).card;
      return await addFlag(profile?.node, profile?.guid, channelId, topicId);
    },
    getChannelNotifications: async (cardId, channelId) => {
      const { detail, profile } = (cards.current.get(cardId) || {}).card;
      const token = `${profile?.guid}.${detail?.token}`;
      return await getContactChannelNotifications(profile?.node, token, channelId);
    },
    setChannelNotifications: async (cardId, channelId, notify) => {
      const { detail, profile } = (cards.current.get(cardId) || {}).card;
      const token = `${profile?.guid}.${detail?.token}`;
      return await setContactChannelNotifications(profile?.node, token, channelId, notify);
    },
    getTopicItems: async (cardId, channelId) => {
      const { guid } = access.current || {};
      return await store.actions.getCardChannelTopicItems(guid, cardId, channelId);
    },
    getTopicItemsId: async (cardId, channelId) => {
      const { guid } = access.current || {};
      return await store.actions.getCardChannelTopicItemsId(guid, cardId, channelId);
    },
    getTopicItemsById: async (cardId, channelId, topics) => {
      const { guid } = access.current || {};
      return await store.actions.getCardChannelTopicItemsById(guid, cardId, channelId, topics);
    },
    setTopicItem: async (cardId, channelId, topicId, topic) => {
      const { guid } = access.current || {};
      return await store.actions.setCardChannelTopicItem(guid, cardId, channelId, topicId, topic);
    },
    clearTopicItem: async (cardId, channelId, topicId) => {
      const { guid } = access.current || {};
      return await store.actions.clearCardChannelTopicItem(guid, cardId, channelId, topicId);
    },
    clearTopicItems: async (cardId, channelId) => {
      const { guid } = access.current || {};
      return await store.actions.clearCardChannelTopicItems(guid, cardId, channelId);
    },
    setUnsealedChannelSubject: async (cardId, channelId, revision, unsealed) => {
      const { guid } = access.current || {};
      await store.actions.setCardChannelItemUnsealedDetail(guid, cardId, channelId, revision, unsealed);
      setCardChannelField(cardId, channelId, 'unsealedDetail', unsealed);
    },
    setUnsealedChannelSummary: async (cardId, channelId, revision, unsealed) => {
      const { guid } = access.current || {};
      await store.actions.setCardChannelItemUnsealedSummary(guid, cardId, channelId, revision, unsealed);
      setCardChannelField(cardId, channelId, 'unsealedSummary', unsealed);
    },
    setUnsealedTopicSubject: async (cardId, channelId, topicId, revision, unsealed) => {
      const { guid } = access.current || {};
      await store.actions.setCardChannelTopicItemUnsealedDetail(guid, cardId, channelId, topicId, revision, unsealed);
    },    
    resync: async () => {
      await sync();
    },
    resyncCard: async (cardId) => {
      await resyncCard(cardId);
    },
  }
  
  return { state, actions }
}

