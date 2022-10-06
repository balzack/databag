import { useState, useRef, useContext } from 'react';
import { StoreContext } from 'context/StoreContext';
import { getCards } from 'api/getCards';
import { getCardProfile } from 'api/getCardProfile';
import { getCardDetail } from 'api/getCardDetail';

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

export function useCardContext() {
  const [state, setState] = useState({
    cards: new Map(),
  });
  const store = useContext(StoreContext);

  const session = useRef(null);
  const curRevision = useRef(null);
  const setRevision = useRef(null);
  const syncing = useRef(false);
  const cards = useRef(new Map());
  const cardChannels = useRef(new Map());

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const getCard = (cardId) => {
    const card = cards.current.get(cardId);
    if (!card) {
      throw new Error('cared not found');
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
  const setCardProfile = (cardId, profile, revision) => {
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
      summary: channel?.data?.channelSummary,
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
  const clearCardChannel = (cardId, channelId) => {
    let card = cards.current.get(cardId);
    if (card) {
      card.channels.delete(channelId);
      cards.current.set(cardId, card);
    }
  }

  const sync = async () => {
    if (!syncing.current && setRevision.current !== curRevision.current) {
      syncing.current = true;

      try {
        const revision = curRevision.current;
        const { server, appToken, guid } = session.current;

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
                  setCardProfile(card.id, profile, profileRevision);
                }
                await store.actions.setCardItemRevision(guid, card.id, card.revision);
                setCardRevision(card.id, card.revision);
              }
            }

            const status = await store.actions.getCardItemStatus(guid, card.id);
            const cardServer = status.profile.node;
            const cardToken = status.profile.guid + '.' + status.detail.token;
            if (status.detail.status === 'connected') {
              try {
                const { notifiedView, notifiedProfile, notifiedArticle, notifiedChannel } = card.data;
                if (status.notifiedView !== notifiedView) {
                  await store.actions.clearCardChannelItems(guid, card.id);
                  await updateCardChannelItems(card.id, cardServer, cardToken, notifiedView, null);
                  await store.actions.setCardItemNotifiedChannel(guid, card.id, notifiedChannel);
                  await store.actions.setCardItemNotifiedView(guid, card.id, notifiedView);
                  clearCardChannel(card.id);
                }
                else {
                  if (status.notifiedChannel != notifiedChannel) {
                    await updateCardChannelItems(card.id, cardServer, cardToken, status.notifiedView, status.notifiedChannel)
                    await store.actions.setCardItemNotifiedChannel(guid, card.id, notifiedChannel);
                  }
                }
                if (status.notifiedProflile != notifiedProfile) {
                  // TODO update contact profile if different
                  await store.actions.setCardItemNotifiedProfile(guid, card.id, notifiedProfile);
                }
                if (status.offsync) {
                  await store.actions.clearCardItemOffsync(guid, card.id);
                  setCardOffsync(card.id, false);
                }
              }
              catch(err) {
                console.log("card1:", err);
                await store.actions.setCardItemOffsync(guid, card.id);
                setCardOffsync(card.id, true);
              } 
            }
          }
          else {
            //TODO clear card channel topics
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

      updateState({ cards: cards.current });
      syncing.current = false;
      sync();
    }
  };

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
    setSession: async (access) => {
      const { guid, server, appToken } = access;
      cards.current = new Map();
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
    clearSession: () => {
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
    addCard: async (message) => {
      const { server, appToken } = session.current;
      return await addCard(server, appToken, message);
    },
    removeCard: async (cardId) => {
      const { server, appToken } = session.current;
      return await removeCard(server, appToken, cardId);
    },
    setCardConnecting: async (cardId) => {
      const { server, appToken } = session.current;
      return await setCardConnecting(server, appToken, cardId);
    },
    setCardConnected: async (cardId, token, rev) => {
      const { server, appToken } = session.current;
      return await setCardConnected(server, appToken, cardId, token,
          rev.viewRevision, rev.articleRevision, rev.channelRevision, rev.profileRevision);
    },
    setCardConfirmed: async (cardId) => {
      const { server, appToken } = session.current;
      return await setCardConfirmed(server, appToken, cardId);
    },
    getCardOpenMessage: async (cardId) => {
      const { server, appToken } = session.current;
      return await getCardOpenMessage(server, appToken, cardId);
    },
    setCardOpenMessage: async (server, message) => {
      return await setCardOpenMessage(server, message);
    },
    getCardCloseMessage: async (cardId) => {
      const { server, appToken } = session.current;
      return await getCardCloseMessage(server, appToken, cardId);
    },
    setCardCloseMessage: async (server, message) => {
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
      const { detail, profile } = getCard(cardId);
      return await getContactChannelTopic(profile.node, `${profile.guid}.${detail.token}`, channelId, topicId);
    },
    getChannelTopics: async (cardId, channelId, revision) => {
      const { detail, profile } = getCard(cardId);
      return await getContactChannelTopics(profile.node, `${profile.guid}.${detail.token}`, channelId, revision);
    },
    getChannelTopicAssetUrl: (cardId, channelId, topicId, assetId) => {
      const { detail, profile } = getCard(cardId);
      return getContactChannelTopicAssetUrl(profile.node, `${profile.guid}.${detail.token}`, channelId, topicId, assetId);
    },
    addChannelTopic: async (cardId, channelId, message, assets) => {
      const { detail, profile } = getCard(cardId);
      if (assets?.length > 0) {
        console.log("UPLOAD");
      }
      else {
        await addContactChannelTopic(profile.node, `${profile.guid}.${detail.token}`, channelId, message, []);
        // sync channel
      }
    },
    setChannelTopicSubject: async (cardId, channelId, topicId, data) => {
      const { detail, profile } = getCard(cardId);
      return await setContactChannelTopicSubject(profile.node, `${profile.guid}.${detail.token}`, channelId, topicId, data);
    },
    removeChannel: async (cardId, channelId) => {
      const { detail, profile } = getCard(cardId);
      return await removeChannel(profile.node, `${profile.guid}.${detail.token}`, channelId);
    },
    removeChannelTopic: async (cardId, channelId, topicId) => {
      const { detail, profile } = getCard(cardId);
      return await removeChannelTopic(profile.node, `${profile.guid}.${detail.token}`, channelId, topicId);
    },
  }

  return { state, actions }
}

