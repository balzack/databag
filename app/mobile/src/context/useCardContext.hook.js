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
  const force = useRef(false);
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
      cards.set(cardId, { ...card });
      updateState({ cards: cards.current });
    }
  };

  const setCardChannelItem = (cardChannel) => {
    return {
      channelId: cardChannel.id,
      revision: cardChannel.revision,
      detailRevision: cardChannel.data.detailRevision,
      topicRevision: cardChannel.data.topicRevision,
      detail = cardChannel.data.detail,
      summary = cardChannel.data.summary,
    };
  };

  const setCardChannelField = (cardId, channelId, field, value) => {
    const card = cards.current.get(cardId);
    if (card) {
      const channel = card.channels.get(channelId);
      if (channel) {
        channel[field] = value;
        card.channels.set(channelId, { ...channel });
        cards.current.set(cardId, { ...card });
      }
    }
  };
    
  const resync = async () => {
    try {
      force.current = true;
      await sync();
    }
    catch (err) {
      console.log(err);
    }
  };

  const resyncCard = async (cardId) => {
    if (!syncing.current) {
      syncing.current = true;

      try {
        const { server, token, guid } = session.current;
        const entry = cards.current.get(cardId);
        if (entry?.card?.detail === 'connected') {
          const card = await getCard(server, token, cardId);
          const { notifiedView, notifiedProfile, notifiedArticle, notifiedChannel } = card.data || {};
          const cardRevision = { view: notifiedView, profile: notifiedProfile, artcile: notifiedArticle, channel: notifiedChannel };
          await syncCard(server, token, guid, entry, cardRevision);
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
    if (!syncing.current && (setRevision.current !== curRevision.current || force.current)) {
      syncing.current = true;
      force.current = false;

      try {
        const { server, token, guid } = session.current;
        const revision = curRevision.current;
        const delta = await getCards(server, token, setRevision.current);
        for (let card of delta) {
          if (card.data) {
            const item = setCardItem(card);
            const entry = cards.current.get(card.id) || { card: {}, channels: new Map() };
            const { profileRevision, detailRevision } = entry.card; 
            if (item.profileRevision !== profileRevision) {
              entry.card.profileRevision = item.profileRevision;
              entry.card.profile = await getCardProfile(server, token, card.id);
              await store.actions.setCardItemProfile(guid, card.id, entry.card.profileRevision, entry.card.profile);
            }
            if (item.detailRevision !== detailRevision) {
              entry.card.detailRevision = item.detailRevision;
              entry.card.detail = await getCardDetail(server, token, card.id);
              await store.actions.setCardItemDetail(guid, card.id, item.detailRevision, item.detail);
            }
            if (entry.card.detail?.state === 'connected' && !entry.card.offsync) {
              try {
                const { notifiedView, notifiedProfile, notifiedArticle, notifiedChannel } = item;
                const cardRevision = { view: notifiedView, profile: notifiedProfile, article: notifiedArticle, channel: notifiedChannel };
                await syncCard(server, token, guid, entry, cardRevision);
              }
              catch (err) {
                console.log(err);
                entry.offsync = true;
              }
            }
            cards.current.set(card.id, entry); 
          }
          else {
            const entry = cards.current.get(card.id) || { card: {}, channels: new Map() };
            entry.channels.forEach((value, key) => {
              await store.actions.clearCardChannelTopicItems(guid, card.id, key);
            });
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
      const message = await getContactProfile(cardServer, cardToken);
      await setCardProfile(server, token, cardId, message);
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
          const channelEntry = entry.channels.get(channel.id) || {};
          const { detailRevision, topicRevision } = channelEntry;
          if (item.detailRevision !== detailRevision) {
            channelEntry.detail = await getContactChannelDetail(cardServer, cardToken, channel.id);
            channelEntry.detailRevision = detailRevision;
            await store.actions.setCardChannelItemDetail(guid, cardId, channel.id, detailRevision, channelEntry.detail);
          }
          if (item.topicRevision !== topicRevision) {
            channelEntry.summary = await getContactChannelSummary(cardServer, cardToken, channel.id);
            channelEntry.topicRevision = topicRevision;
            await store.actions.setCardChannelItemSummary(guid, cardId, channel.id, topicRevision, channelEntry.summary);
          }
          entry.card.notifiedChannel = cardRevision.channel;
          await store.actions.setCardItemNotifiedChannel(guid, cardId, channelRevision.channel);
          entry.card.notifiedView = cardRevision.view;
          await store.actions.setCardItemNotifiedView(guid, cardId, channelRevision.view);
          entry.channel.set(channel.id, channelEntry);
        }
        else {
          await store.actions.clearCardChannelTopicItems(guid, card.id, channel.id);
          await store.actions.clearCardChannelItem(guid, card.id, channel.id);
          entry.channel.delete(channel.id);
        }
      }
    }
  };

  const actions = {

    setSession: (session) => {
      if (access.current || syncing.current) {
        throw new Error('invalid card state');
      }
      access.current = session;
      cards.current = new Map();
      const cardItems = await store.actions.getCardItems(session.guid);
      for(card of cardItems) {
        cards.current.set(card.cardId, { card, channels: new Map() });
      }
      const cardChannelItems = await store.actions.getCardChannelItems(guid);
      for (cardChannel of cardChannelItems) {
        const card = cards.current.get(cardChannel.cardId);
        if (card) {
          card.channels.set(card.channelId, cardChannel);
        }
      }
      const status = await store.actions.getCardRequestStatus(guid);

      const revision = await store.actions.getCardRevision(session.guid);
      curRevision.current = revision;
      setRevision.current = revision;
      setState({ offsync: false, viewRevision: status?.revision, channels: channels.current });
    },
    clearSession: () => {
      access.current = null;
    },
    setRevision: async (revision) => {
      curRevision.current = revision;
      await sync();
    },
    addCard: async (message) => {
      const { server, token } = access.current;
      return await addCard(server, token, message);
    },
    removeCard: async (cardId) => {
      const { server, token } = access.current;
      return await removeCard(server, token, cardId);
    },
    setCardConnecting: async (cardId) => {
      const { server, token } = access.current;
      return await setCardConnecting(server, token, cardId);
    },
    setCardConnected: async (cardId, cardToken, revision) => {
      const { server, token } = access.current;
      return await setCardConnected(server, token, cardId, cardToken,
          revision.viewRevision, revision.articleRevision,
          revision.channelRevision, revision.profileRevision);
    },
    setCardConfirmed: async (cardId) => {
      const { server, token } = access.current;
      return await setCardConfirmed(server, token, cardId);
    },
    getCardOpenMessage: async (cardId) => {
      const { server, token } = access.current;
      return await getCardOpenMessage(server, token, cardId);
    },
    setCardOpenMessage: async (server, message) => {
      return await setCardOpenMessage(server, message);
    },
    getCardCloseMessage: async (cardId) => {
      const { server, token } = access.current;
      return await getCardCloseMessage(server, token, cardId);
    },
    setCardCloseMessage: async (server, message) => {
      return await setCardCloseMessage(server, message);
    },
    getCardImageUrl: (cardId) => {
      const { server, token } = access.current;
      return getCardImageUrl(server, token, cardId, revision);
    },
    removeChannel: async (cardId, channelId) => {
      const { detail, profile } = cards.current.get(cardId) || {};
      const cardToken = `${profile?.guid}.${detail?.token}`;
      return await removeContactChannel(profile?.node, cardToken, channelId);
    },
    addTopic: async (cardId, channelId, type, type, message, files) => {
      const { detail, profile } = cards.current.get(cardId) || {};
      const cardToken = `${profile?.guid}.${detail?.token}`;
      const node = profile?.node;
      if (files?.length > 0) {
        const topicId = await addContactChannelTopic(node, token, channelId, null, null, null);
        upload.actions.addContactTopic(node, token, cardId, channelId, topicId, files, async (assets) => {
          const subject = message(assets);
          await setContactChannelTopicSubject(node, token, channelId, topicId, type, subject);
        }, async () => {
          try {
            await removeContactChannelTopic(node, token, channelId, topicId);
          }
          catch (err) {
            console.log(err);
          }
        });
      }
      else {
        const subject = message([]);
        await addContactChannelTopic(node, token, channelId, type, subject, []);
      }
    },
    removeTopic: async (cardId, channelId, topicId) => {
      const { detail, profile } = cards.current.get(cardId) || {};
      const cardToken = `${profile?.guid}.${detail?.token}`;
      return await removeContactChannelTopic(profile?.node, cardToken, channelId, topicId);
    },
    setTopicSubject: async (cardId, channelId, topicId, type, subject) => {
      const { detail, profile } = cards.current.get(cardId) || {};
      const cardToken = `${profile?.guid}.${detail?.token}`;
      return await setContactChannelTopicSubject(profile?.node, cardToken, channelId, topicId, type, subject);
    },
    getTopicAssetUrl: (cardId, channelId, topicId, assetId) => {
      const { detail, profile } = cards.current.get(cardId) || {};
      const cardToken = `${profile?.guid}.${detail?.token}`;
      return getContactChannelTopicAssetUrl(profile?.node, cardToken, channelId, topicId, assetId);
    },
    getTopics: async (cardId, channelId, revision, count, begin, end) => {
      const { detail, profile } = cards.current.get(cardId) || {};
      const cardToken = `${profile?.guid}.${detail?.token}`;
      return await store.actions.getCardChannelTopicItems(guid, cardId, channelId);
    },
    getChannelTopic: async (cardId, channelId, topicId) => {
      const { detail, profile } = cards.current.get(cardId) || {};
      const cardToken = `${profile?.guid}.${detail?.token}`;
      return await getContactChannelTopic(profile?.node, cardToken, channelId, topicId);
    },
    setContactRevision: async (cardId, revision) => {
      const { guid } = acccess.current
      await store.actions.setCardRequestStatus(guid, { revision });
      updateState({ viewRevision: revision });
    },
    setChannelReadRevision: async (cardId, channelId, revision) => {
      const { guid } = access.current;
      await store.actions.setCardChannelItemReadRevision(guid, cardId, channelId, revision);
      setCardField(cardId, 'readRevision', revision);
    },
    setChannelSyncRevision: async (cardId, channelId, revision) => {
      const { guid } = access.current;
      await store.actions.setCardChannelItemSyncRevision(guid, cardId, channelId, revision);
      setCardField(cardId, 'syncRevision', revision);
    },
    setChannelTopicMarker: async (cardId, channelId, marker) => {
      const { guid } = access.current;
      await store.actions.setCardChannelItemTopicMarker(guid, cardId, channelId, marker);
      setCardField(cardId, 'topicMarker', marker);
    },
    setCardFlag: async (cardId) => {
      const { guid } = acccess.current;
      await store.actions.setCardItemBlocked(guid, cardId);
      setCardField(cardId, 'blocked', true);
    },
    clearCardFlag: async (cardId) => {
      const { guid } = acccess.current;
      await store.actions.clearCardItemBlocked(guid, cardId);
      setCardField(cardId, 'blocked', false);
    },
    setChannelFlag: async (cardId, channelId) => {
      const { guid } = access.current;
      await store.actions.setCardChannelItemBlocked(guid, cardId, channelId);
      setCardChannelField(cardId, channelId, 'blocked', true);
    },
    clearChannelFlag: async (cardId, channelId) => {
      const { guid } = access.current;
      await store.actions.setCardChannelItemBlocked(guid, cardId, channelId);
      setCardChannelField(cardId, channelId, 'blocked', false);
    },
    setTopicFlag: async (cardId, channelId, topicId) => {
      const { guid } = access.current;
      await store.actions.setCardChannelTopicBlocked(guid, cardId, channelId, topicId, true);
    },
    clearTopicFlag: async (cardId, channelId, topicId) => {
      const { guid } = access.current;
      await store.actions.setCardChannelTopicBlocked(guid, cardId, channelId, topicId, false);
    },
    addChannelAlert: async (cardId, channelId) => {
      const { profile } = cards.current.get(cardId) || {};
      return await addFlag(profile?.node, profile?.guid, channelId);
    },
    addTopicAlert: async (cardId, channelId, topicId) => {
      const { detail, profile } = cards.current.get(cardId) || {};
      return await addFlag(profile?.node, profile?.guid, channelId, topicId);
    },

    getChannelNotifications: async (cardId, channelId) => {
      const { detail, profile } = cards.current.get(cardId) || {};
      const token = `${profile?.guid}.${detail?.token}`;
      return await getContactChannelNotifications(profile?.node, token, channelId);
    },
    setChannelNotifications: async (cardId, channelId, notify) => {
      const { detail, profile } = cards.current.get(cardId) || {};
      const token = `${profile?.guid}.${detail?.token}`;
      return await setContactChannelNotifications(profile?.node, token, channelId, notify);
    },

    getTopicItems: async (cardId, channelId) => {
      const { guid } = access.current;
      return await store.actions.getCardChannelTopicItems(guid, cardId, channelId);
    },
    setChannelTopicItem: async (cardId, channelId, topicId, topic) => {
      const { guid } = access.current;
      return await store.actions.setCardChannelTopicItem(guid, cardId, channelId, topicId, topic);
    },
    clearChannelTopicItem: async (cardId, channelId, topicId) => {
      const { guid } = access.current;
      return await store.actions.clearCardChannelTopicItem(guid, cardId, channelId, topicId);
    },
    clearChannelTopicItems: async (cardId, channelId) => {
      const { guid } = access.current;
      return await store.actions.clearCardChannelTopicItems(guid, cardId, channelId);
    },

    setUnsealedChannelSubject: async (cardId, channelId, revision, unsealed) => {
      const { guid } = access.current;
      await store.actions.setCardChannelItemUnsealedDetail(guid, cardId, channelId, revision, unsealed);
    },
    setUnsealedChannelSummary: async (cardId, channelId, revision, unsealed) => {
      const { guid } = session.current;
      await store.actions.setCardChannelItemUnsealedSummary(guid, cardId, channelId, revision, unsealed);
    },
    setUnsealedTopicSubject: async (cardId, channelId, topicId, revision, unsealed) => {
      const { guid } = access.current;
      await store.actions.setCardChannelTopicItemUnsealedDetail(guid, cardId, channelId, topicId, revision, unsealed);
    },    
    resync: async () => {
      await resync();
    },
    resyncCard: async (cardId) => {
      await resyncCard(cardId);
    },
  }
  
  return { state, actions }
}

