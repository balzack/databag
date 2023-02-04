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






  const unsealKey = async (seals, sealKey) => {
    let seal;
    if (seals?.length) { 
      seals.forEach(s => {
        if (s.publicKey === sealKey.public) {
          seal = s;
        }
      });
    }
    if (seal) { 
    const key = '-----BEGIN RSA PRIVATE KEY-----\n' + sealKey.private + '\n-----END RSA PRIVATE KEY-----'
    return await RSA.decrypt(seal.sealedKey, key);
    }
    return null;
  };

  const getCardEntry = (cardId) => {
    const card = cards.current.get(cardId);
    if (!card) {
      throw new Error('card not found');
    }
    return card;
  }

  const setCard = (cardId, card) => {
    let updated = cards.current.get(cardId);
    if (updated == null) {
      updated = { channels: new Map() };
    }
    cards.current.set(cardId, {
      ...updated,
      cardId: cardId,
      revision: card?.revision,
      detailRevision: card?.data?.detailRevision,
      profileRevision: card?.data?.profileRevision,
      detail: card?.data?.cardDetail,
      profile: card?.data?.cardProfile,
      notifiedView: card?.data?.notifiedView,
      notifiedProfile: card?.data?.notifiedProfile,
      notifiedArtile: card?.data?.notifiedArticle,
      notifiedChannel: card?.data?.notifiedChannel,
    });
  }
  const setCardDetail = (cardId, detail, revision) => {
    let card = cards.current.get(cardId);
    if (card) {
      card.detail = detail;
      card.detailRevision = revision;
      cards.current.set(cardId, card);
    }
  }
  const setCardIdentity = (cardId, profile, revision) => {
    let card = cards.current.get(cardId);
    if (card) {
      card.profile = profile;
      card.profileRevision = revision;
      cards.current.set(cardId, card);
    }
  }
  const setCardRevision = (cardId, revision) => {
    let card = cards.current.get(cardId);
    if (card) {
      card.revision = revision;
      cards.current.set(cardId, card);
    }
  }
  const setCardOffsync = (cardId, offsync) => {
    let card = cards.current.get(cardId);
    if (card) {
      card.offsync = offsync;
      cards.current.set(cardId, card);
    }
  }
  const setCardBlocked = (cardId, blocked) => {
    let card = cards.current.get(cardId);
    if (card) {
      card.blocked = blocked;
      cards.current.set(cardId, card);
    }
  }
  const clearCardChannels = (cardId) => {
    let card = cards.current.get(cardId);
    if (card) {
      card.channels = new Map();
      cards.current.set(cardId, card);
    }
  }
  const setCardChannel = (cardId, channel) => {
    setCardChannelItem(cardId, {
      cardId: cardId,
      channelId: channel?.id,
      revision: channel?.revision,
      detailRevision: channel?.data?.detailRevision,
      topicRevision: channel?.data?.topicRevision,
      detail: channel?.data?.channelDetail,
      unsealedDetail: null,
      summary: channel?.data?.channelSummary,
      unsealedSummary: null,
    });
  }
  const setCardChannelItem = (cardId, channel) => {
    let card = cards.current.get(cardId);
    if (card) {
      card.channels.set(channel.channelId, channel);
      cards.current.set(cardId, card);
    }
  }
  const setCardChannelDetail = (cardId, channelId, detail, revision) => {
    let card = cards.current.get(cardId);
    if (card) {
      let channel = card.channels.get(channelId);
      if (channel) {
        channel.detail = detail;
        channel.unsealedDetail = null;
        channel.detailRevision = revision;
        card.channels.set(channelId, channel);
        cards.current.set(cardId, card);
      }
    }
  }
  const setCardChannelSummary = (cardId, channelId, summary, revision) => {
    let card = cards.current.get(cardId);
    if (card) {
      let channel = card.channels.get(channelId);
      if (channel) {
        channel.summary = summary;
        channel.unsealedSummary = null;
        channel.topicRevision = revision;
        card.channels.set(channelId, channel);
        cards.current.set(cardId, card);
      }
    }
  }
  const setCardChannelRevision = (cardId, channelId, revision) => {
    let card = cards.current.get(cardId);
    if (card) {
      let channel = card.channels.get(channelId);
      if (channel) {
        channel.revision = revision;
        card.channels.set(channelId, channel);
        cards.current.set(cardId, card);
      }
    }
  }
  const setCardChannelReadRevision = (cardId, channelId, revision) => {
    let card = cards.current.get(cardId);
    if (card) {
      let channel = card.channels.get(channelId);
      if (channel) {
        channel.readRevision = revision;
        card.channels.set(channelId, channel);
        cards.current.set(cardId, card);
      }
    }
  }
  const setCardChannelSyncRevision = (cardId, channelId, revision) => {
    let card = cards.current.get(cardId);
    if (card) {
      let channel = card.channels.get(channelId);
      if (channel) {
        channel.syncRevision = revision;
        card.channels.set(channelId, channel);
        cards.current.set(cardId, card);
      }
    }
  }
  const setCardChannelTopicMarker = (cardId, channelId, marker) => {
    let card = cards.current.get(cardId);
    if (card) {
      let channel = card.channels.get(channelId);
      if (channel) {
        channel.topicMarker = marker;
        card.channels.set(channelId, channel);
        cards.current.set(cardId, card);
      }
    }
  }
  const setCardChannelBlocked = (cardId, channelId, blocked) => {
    let card = cards.current.get(cardId);
    if (card) {
      let channel = card.channels.get(channelId);
      if (channel) {
        channel.blocked = blocked;
        card.channels.set(channelId, channel);
        cards.current.set(cardId, card);
      }
    }
  }
  const clearCardChannel = (cardId, channelId) => {
    let card = cards.current.get(cardId);
    if (card) {
      card.channels.delete(channelId);
      cards.current.set(cardId, card);
    }
  }

  const sync = async () => {
    if (!syncing.current && (setRevision.current !== curRevision.current || resync.current.length > 0)) {
      syncing.current = true;
      const { server, appToken, guid } = session.current;

      try {
        const revision = curRevision.current;

        // get and store
        const delta = await getCards(server, appToken, setRevision.current);
        for (let card of delta) {
          if (card.data) {
            if (card.data.cardDetail && card.data.cardProfile) {
              await store.actions.setCardItem(guid, card);
              setCard(card.id, card);
            }
            else {
              const view = await store.actions.getCardItemView(guid, card.id);
              if (view == null) {
                let assembled = JSON.parse(JSON.stringify(card));
                assembled.data.cardDetail = await getCardDetail(server, appToken, card.id);
                assembled.data.cardProfile = await getCardProfile(server, appToken, card.id);
                await store.actions.setCardItem(guid, assembled);
                setCard(assembled.id, assembled);
              }
              else {
                const { detailRevision, profileRevision } = card.data;
                if (view.detailRevision != detailRevision) {
                  const detail = await getCardDetail(server, appToken, card.id);
                  await store.actions.setCardItemDetail(guid, card.id, detailRevision, detail);
                  setCardDetail(card.id, detail, detailRevision);
                }
                if (view.profileRevision != profileRevision) {
                  const profile = await getCardProfile(server, appToken, card.id);
                  await store.actions.setCardItemProfile(guid, card.id, profileRevision, profile);
                  setCardIdentity(card.id, profile, profileRevision);
                }
                await store.actions.setCardItemRevision(guid, card.id, card.revision);
                setCardRevision(card.id, card.revision);
              }
            }

            await syncCard(card);
          }
          else {
            await store.actions.clearCardChannelItems(guid, card.id); 
            await store.actions.clearCardItem(guid, card.id);
            cards.current.delete(card.id);
          }
        }

        setRevision.current = revision;
        await store.actions.setCardRevision(guid, revision);
      }
      catch(err) {
        console.log("card2:", err);
        syncing.current = false;
        return;
      }

      if (resync.current.length > 0) {
        const ids = resync.current;
        resync.current = [];

        for(let i = 0; i < ids.length; i++) {
          const item = cards.current.get(ids[i]);
          if (item) {
            const card = await getCard(server, appToken, ids[i]);
            await syncCard(card);
          }
        }
      }

      updateState({ cards: cards.current });
      syncing.current = false;
      sync();
    }
  };

  const syncCard = async (card) => {

    const { server, appToken, guid } = session.current;
    const status = await store.actions.getCardItemStatus(guid, card.id);
    const cardServer = status.profile.node;
    const cardToken = status.profile.guid + '.' + status.detail.token;
    if (status.detail.status === 'connected') {
      try {
        const { notifiedView, notifiedProfile, notifiedArticle, notifiedChannel } = card.data;
        if (status.notifiedView !== notifiedView) {
          await store.actions.clearCardChannelItems(guid, card.id);
          clearCardChannels(card.id);
          await updateCardChannelItems(card.id, cardServer, cardToken, notifiedView, null);
          await store.actions.setCardItemNotifiedChannel(guid, card.id, notifiedChannel);
          await store.actions.setCardItemNotifiedView(guid, card.id, notifiedView);
        }
        else {
          if (status.notifiedChannel != notifiedChannel) {
            await updateCardChannelItems(card.id, cardServer, cardToken, status.notifiedView, status.notifiedChannel)
            await store.actions.setCardItemNotifiedChannel(guid, card.id, notifiedChannel);
          }
        }
        if (status.notifiedProfile != notifiedProfile) {
          const message = await getContactProfile(cardServer, cardToken);
          await setCardProfile(server, appToken, card.id, message);
          await store.actions.setCardItemNotifiedProfile(guid, card.id, notifiedProfile);
        }
        if (status.offsync) {
          await store.actions.clearCardItemOffsync(guid, card.id);
          setCardOffsync(card.id, 0);
        }
      }
      catch(err) {
        console.log("card1:", err);
        await store.actions.setCardItemOffsync(guid, card.id);
        setCardOffsync(card.id, 1);
      } 
    }
    else {
      await store.actions.clearCardChannelItems(guid, card.id);
      clearCardChannels(card.id);
    }
  }

  const updateCardChannelItems = async (cardId, cardServer, cardToken, notifiedView, notifiedChannel) => {
    const { guid } = session.current;
    const delta = await getContactChannels(cardServer, cardToken, notifiedView, notifiedChannel);

    for (let channel of delta) {
      if (channel.data) {
        if (channel.data.channelDetail && channel.data.channelSummary) {
          await store.actions.setCardChannelItem(guid, cardId, channel);
          setCardChannel(cardId, channel);
        }
        else {
          const { detailRevision, topicRevision, channelDetail, channelSummary } = channel.data;
          const view = await store.actions.getCardChannelItemView(guid, cardId, channel.id);
          if (view == null) {
            console.log('alert: expected channel not synced');
            let assembled = JSON.parse(JSON.stringify(channel));
            assembled.data.channelDetail = await getContactChannelDetail(cardServer, cardToken, channel.id);
            assembled.data.channelSummary = await getContactChannelSummary(cardServer, cardToken, channel.id);
            await store.actions.setCardChannelItem(guid, cardId, assembled);
            setCardChannel(cardId, assembled);
          }
          else {
            if (view.detailRevision != detailRevision) {
              const detail = await getContactChannelDetail(cardServer, cardToken, channel.id);
              await store.actions.setCardChannelItemDetail(guid, cardId, channel.id, detailRevision, detail);
              setCardChannelDetail(cardId, channel.id, detail, detailRevision);
            }
            if (view.topicRevision != topicRevision) {
              const summary = await getContactChannelSummary(cardServer, cardToken, channel.id);
              await store.actions.setCardChannelItemSummary(guid, cardId, channel.id, topicRevision, summary);
              setCardChannelSummary(cardId, channel.id, summary, topicRevision);
            }
            await store.actions.setCardChannelItemRevision(guid, cardId, channel.id, channel.revision);
            setCardChannelRevision(cardId, channel.id, channel.revision);
          }
        }
      }
      else {
        await store.actions.clearCardChannelItem(guid, cardId, channel.id);
        clearCardChannel(cardId, channel.id);
      }
    }
  }

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
      const revision = await store.actions.getCardRevision(session.guid);
      curRevision.current = revision;
      setRevision.current = revision;
      setState({ offsync: false, channels: channels.current });
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
    },
    removeChannel: async (cardId, channelId) => {
    },
    addTopic: async (cardId, channelId, type, message, files) => {
    },
    removeTopic: async (cardId, channelId, topicId) => {
    },
    setTopicSubject: async (cardId, channelId, topicId, type, subject) => {
    },
    getTopicAssetUrl: (cardId, channelId, topicId, assetId) => {
    },
    getTopics: async (cardId, channelId, revision, count, begin, end) => {
    },
    getTopic: async (cardId, channelId, topicId) => {
    },
    resync: async () => {
    },
    resyncCard: async (cardId) => {
    },

    setContactRevision: async (cardId, revision) => {
    },
    setCardFlag: async (cardId) => {
    },
    clearCardFlag: async (cardId) => {
    },
    setChannelReadRevision: async (cardId, channelId, revision) => {
    },
    setChannelSyncRevision: async (cardId, channelId, revision) => {
    },
    setChannelTopicMarker: async (cardId, channelId, marker) => {
    },
    addChannelAlert: async (cardId, channelId) => {
    },
    setChannelFlag: async (cardId, channelId) => {
    },
    clearChannelFlag: async (cardId, channelId) => {
    },
    getChannelNotifications: async (cardId, channelId) => {
    },
    setChannelNotifications: async (cardId, channelId, notify) => {
    },
    addTopicAlert: async (cardId, channelId, topicId) => {
    },
    setTopicFlag: async (cardId, channelId, topicId) => {
    },
    clearTopicFlag: async (cardId, channelId, topicId) => {
    },

    getTopicItems: async (cardId, channelId, revision, count, begin, end) => {
    },
    getTopicItem: async (cardId, channelId, topicId) => {
    },
    setTopicItem: async (cardId, channelId, topic) => {
    },
    clearTopicItem: async (cardId, channelId) => {
    },
    
    setUnsealedChannelSubject: async (cardId, channelId, revision, unsealed) => {
    },
    setUnsealedChannelSummary: async (cardId, channelId, revision, unsealed) => {
    },
    setUnsealedTopicSubject: async (cardId, channelId, topicId, revision, unsealed) => {
    },    
    

    //setSession: async (access) => {
      const { guid, server, appToken } = access;
      cards.current = new Map();
      const status = await store.actions.getCardRequestStatus(guid);
      updateState({ requestRevision: status.revision });
      const cardItems = await store.actions.getCardItems(guid);
      for (item of cardItems) {
        cards.current.set(item.cardId, { ...item, channels: new Map() });
      }
      const cardChannelItems = await store.actions.getCardChannelItems(guid);
      for (item of cardChannelItems) {
        setCardChannelItem(item.cardId, item);
      }
      const revision = await store.actions.getCardRevision(guid);
      updateState({ cards: cards.current });
      setRevision.current = revision;
      curRevision.current = revision;
      session.current = access;
    },
    setRequestRevision: async (revision) => {
      const { guid } = session.current
      await store.actions.setCardRequestStatus(guid, { revision });
      updateState({ requestRevision: revision });
    },
    //clearSession: () => {
      session.current = {};
      updateState({ account: null });
    },
    setRevision: (rev) => {
      curRevision.current = rev;
      sync();
    },
    setChannelReadRevision: async (cardId, channelId, rev) => {
      await store.actions.setCardChannelItemReadRevision(session.current.guid, cardId, channelId, rev);
      setCardChannelReadRevision(cardId, channelId, rev);
      updateState({ cards: cards.current });
    },
    getCardLogo: (cardId, revision) => {
      const { server, appToken } = session.current;
      return getCardImageUrl(server, appToken, cardId, revision);
    },
    getByGuid: (guid) => {
      let card;
      cards.current.forEach((value, key, map) => {
        if (value?.profile?.guid === guid) {
          card = value;
        }
      });
      return card;
    },
    //addCard: async (message) => {
      const { server, appToken } = session.current;
      return await addCard(server, appToken, message);
    },
    //removeCard: async (cardId) => {
      const { server, appToken } = session.current;
      return await removeCard(server, appToken, cardId);
    },
    //setCardConnecting: async (cardId) => {
      const { server, appToken } = session.current;
      return await setCardConnecting(server, appToken, cardId);
    },
    //setCardConnected: async (cardId, token, rev) => {
      const { server, appToken } = session.current;
      return await setCardConnected(server, appToken, cardId, token,
          rev.viewRevision, rev.articleRevision, rev.channelRevision, rev.profileRevision);
    },
    //setCardConfirmed: async (cardId) => {
      const { server, appToken } = session.current;
      return await setCardConfirmed(server, appToken, cardId);
    },
    //getCardOpenMessage: async (cardId) => {
      const { server, appToken } = session.current;
      return await getCardOpenMessage(server, appToken, cardId);
    },
    //setCardOpenMessage: async (server, message) => {
      return await setCardOpenMessage(server, message);
    },
    //getCardCloseMessage: async (cardId) => {
      const { server, appToken } = session.current;
      return await getCardCloseMessage(server, appToken, cardId);
    },
    //setCardCloseMessage: async (server, message) => {
      return await setCardCloseMessage(server, message);
    },
    setCardBlocked: async (cardId) => {
      const { guid } = session.current;
      setCardBlocked(cardId, true);
      await store.actions.setCardItemBlocked(guid, cardId);
      updateState({ cards: cards.current });
    },
    clearCardBlocked: async (cardId) => {
      const { guid } = session.current;
      setCardBlocked(cardId, false);
      await store.actions.clearCardItemBlocked(guid, cardId);
      updateState({ cards: cards.current });
    },
    setSyncRevision: async (cardId, channelId, revision) => {
      const { guid } = session.current;
      await store.actions.setCardChannelItemSyncRevision(guid, cardId, channelId, revision);
      setCardChannelSyncRevision(cardId, channelId, revision);
      updateState({ cards: cards.current });
    },
    setTopicMarker: async (cardId, channelId, marker) => {
      const { guid } = session.current;
      await store.actions.setCardChannelItemTopicMarker(guid, cardId, channelId, marker);
      setCardChannelTopicMarker(cardId, channelId, marker);
      updateState({ cards: cards.current });
    },
    setChannelBlocked: async (cardId, channelId) => {
      const { guid } = session.current;
      await store.actions.setCardChannelItemBlocked(guid, cardId, channelId);
      setCardChannelBlocked(cardId, channelId, true);
      updateState({ cards: cards.current });
    },
    clearChannelBlocked: async (cardId, channelId) => {
      const { guid } = session.current;
      await store.actions.clearCardChannelItemBlocked(guid, cardId, channelId);
      setCardChannelBlocked(cardId, channelId, false);
      updateState({ cards: cards.current });
    },
    setChannelTopicBlocked: async (cardId, channelId, topicId) => {
      const { guid } = session.current;
      await store.actions.setCardChannelTopicBlocked(guid, cardId, channelId, topicId, true);
    },
    clearChannelTopicBlocked: async (cardId, channelId, topicId) => {
      const { guid } = session.current;
      await store.actions.setCardChannelTopicBlocked(guid, cardId, channelId, topicId, false);
    },
    getChannelTopicBlocked: async () => {
      const { guid } = session.current;
      return await store.actions.getCardChannelTopicBlocked(guid);
    },
    getChannelTopicItems: async (cardId, channelId) => {
      const { guid } = session.current;
      return await store.actions.getCardChannelTopicItems(guid, cardId, channelId);
    },
    setChannelTopicItem: async (cardId, channelId, topicId, topic) => {
      const { guid } = session.current;
      return await store.actions.setCardChannelTopicItem(guid, cardId, channelId, topicId, topic);
    },
    clearChannelTopicItem: async (cardId, channelId, topicId) => {
      const { guid } = session.current;
      return await store.actions.clearCardChannelTopicItem(guid, cardId, channelId, topicId);
    },
    clearChannelTopicItems: async (cardId, channelId) => {
      const { guid } = session.current;
      return await store.actions.clearCardChannelTopicItems(guid, cardId, channelId);
    },
    getChannelTopic: async (cardId, channelId, topicId) => {
      const { detail, profile } = getCardEntry(cardId);
      return await getContactChannelTopic(profile.node, `${profile.guid}.${detail.token}`, channelId, topicId);
    },
    getChannelTopics: async (cardId, channelId, revision, count, begin, end) => {
      const { detail, profile } = getCardEntry(cardId);
      return await getContactChannelTopics(profile.node, `${profile.guid}.${detail.token}`, channelId, revision, count, begin, end);
    },
    getChannelTopicAssetUrl: (cardId, channelId, topicId, assetId) => {
      const { detail, profile } = getCardEntry(cardId);
      return getContactChannelTopicAssetUrl(profile.node, `${profile.guid}.${detail.token}`, channelId, topicId, assetId);
    },
    addChannelTopic: async (cardId, channelId, message, files) => {
      const { detail, profile } = getCardEntry(cardId);
      const node = profile.node;
      const token = `${profile.guid}.${detail.token}`;
      if (files?.length > 0) {
        const topicId = await addContactChannelTopic(node, token, channelId, null, null, null);
        upload.actions.addContactTopic(node, token, cardId, channelId, topicId, files, async (assets) => {
          message.assets = assets;
          await setContactChannelTopicSubject(node, token, channelId, topicId, 'superbasictopic', message);
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
        await addContactChannelTopic(node, token, channelId, 'superbasictopic', message, []);
      }
    },
    addSealedChannelTopic: async (cardId, channelId, message, sealKey) => {
      const { detail, profile } = getCardEntry(cardId);
      const node = profile.node;
      const token = `${profile.guid}.${detail.token}`;
      const iv = CryptoJS.lib.WordArray.random(128 / 8);
      const key = CryptoJS.enc.Hex.parse(sealKey);
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ message }), key, { iv: iv });
      const messageEncrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
      const messageIv = iv.toString();
      await addContactChannelTopic(node, token, channelId, 'sealedtopic', { messageEncrypted, messageIv });
    },
    setChannelTopicSubject: async (cardId, channelId, topicId, dataType, data) => {
      const { detail, profile } = getCardEntry(cardId);
      return await setContactChannelTopicSubject(profile.node, `${profile.guid}.${detail.token}`, channelId, topicId, dataType, data);
    },
    setChannelTopicUnsealedDetail: async (cardId, channelId, topicId, revision, unsealed) => {
      const { guid } = session.current;
      await store.actions.setCardChannelTopicItemUnsealedDetail(guid, cardId, channelId, topicId, revision, unsealed);
    },
    removeChannel: async (cardId, channelId) => {
      const { detail, profile } = getCardEntry(cardId);
      return await removeContactChannel(profile.node, `${profile.guid}.${detail.token}`, channelId);
    },
    removeChannelTopic: async (cardId, channelId, topicId) => {
      const { detail, profile } = getCardEntry(cardId);
      return await removeContactChannelTopic(profile.node, `${profile.guid}.${detail.token}`, channelId, topicId);
    },
    addChannelReport: async (cardId, channelId) => {
      const { detail, profile } = getCardEntry(cardId);
      return await addFlag(profile.node, profile.guid, channelId);
    },
    addChannelTopicReport: async (cardId, channelId, topicId) => {
      const { detail, profile } = getCardEntry(cardId);
      return await addFlag(profile.node, profile.guid, channelId, topicId);
    },
    getChannelNotifications: async (cardId, channelId) => {
      const { detail, profile } = getCardEntry(cardId);
      return await getContactChannelNotifications(profile.node, `${profile.guid}.${detail.token}`, channelId);
    },
    setChannelNotifications: async (cardId, channelId, notify) => {
      const { detail, profile } = getCardEntry(cardId);
      return await setContactChannelNotifications(profile.node, `${profile.guid}.${detail.token}`, channelId, notify);
    },
    unsealChannelSubject: async (cardId, channelId, revision, sealKey) => {
      try {
        const { guid } = session.current;
        const card = cards.current.get(cardId);
        const channel = card.channels.get(channelId);
        const { subjectEncrypted, subjectIv, seals } = JSON.parse(channel.detail.data);
        const unsealedKey = await unsealKey(seals, sealKey);
        if (unsealedKey) {
          const iv = CryptoJS.enc.Hex.parse(subjectIv);
          const key = CryptoJS.enc.Hex.parse(unsealedKey);
          const enc = CryptoJS.enc.Base64.parse(subjectEncrypted);
          let cipher = CryptoJS.lib.CipherParams.create({ ciphertext: enc, iv: iv });
          const dec = CryptoJS.AES.decrypt(cipher, key, { iv: iv });
          if (revision === channel.detailRevision) {
            channel.unsealedDetail = JSON.parse(dec.toString(CryptoJS.enc.Utf8));
            await store.actions.setCardChannelItemUnsealedDetail(guid, cardId, channelId, revision, channel.unsealedDetail);
            card.channels.set(channelId, { ...channel });
            cards.current.set(cardId, { ...card });
            updateState({ cards: cards.current });
          }
        }
      }
      catch(err) {
        console.log(err);
      }
    },
    unsealChannelSummary: async (cardId, channelId, revision, sealKey) => {
      try {
        const { guid } = session.current;
        const card = cards.current.get(cardId);
        const channel = card.channels.get(channelId);
        const { seals } = JSON.parse(channel.detail.data);
        const { messageEncrypted, messageIv } = JSON.parse(channel.summary.lastTopic.data);
        const unsealedKey = await unsealKey(seals, sealKey);
        if (unsealedKey) {
          const iv = CryptoJS.enc.Hex.parse(messageIv);
          const key = CryptoJS.enc.Hex.parse(unsealedKey);
          const enc = CryptoJS.enc.Base64.parse(messageEncrypted);
          let cipher = CryptoJS.lib.CipherParams.create({ ciphertext: enc, iv: iv });
          const dec = CryptoJS.AES.decrypt(cipher, key, { iv: iv });
          if (revision === channel.topicRevision) {
            channel.unsealedSummary = JSON.parse(dec.toString(CryptoJS.enc.Utf8));
            await store.actions.setCardChannelItemUnsealedSummary(guid, cardId, channelId, revision, channel.unsealedSummary);
            card.channels.set(channelId, { ...channel });
            cards.current.set(cardId, { ...card });
            updateState({ cards: cards.current });
          }
        }
      }
      catch(err) {
        console.log(err);
      }
    },
    resync: (cardId) => {
      resync.current.push(cardId);
      sync();
    },
  }
  
  return { state, actions }
}

