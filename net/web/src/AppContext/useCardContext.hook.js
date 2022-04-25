import { useEffect, useState, useRef } from 'react';
import { getContactChannels } from '../Api/getContactChannels';
import { getContactChannel } from '../Api/getContactChannel';
import { getContactProfile } from '../Api/getContactProfile';
import { setCardProfile } from '../Api/setCardProfile';
import { getCards } from '../Api/getCards';
import { getCardImageUrl } from '../Api/getCardImageUrl';
import { getCardProfile } from '../Api/getCardProfile';
import { getCardDetail } from '../Api/getCardDetail';
import { addContactChannelTopic } from '../Api/addContactChannelTopic';
import { setCardConnecting, setCardConnected, setCardConfirmed } from '../Api/setCardStatus';
import { getCardOpenMessage } from '../Api/getCardOpenMessage';
import { setCardOpenMessage } from '../Api/setCardOpenMessage';
import { getCardCloseMessage } from '../Api/getCardCloseMessage';
import { setCardCloseMessage } from '../Api/setCardCloseMessage';
import { getContactChannelTopics } from '../Api/getContactChannelTopics';
import { getContactChannelTopic } from '../Api/getContactChannelTopic';
import { addCard } from '../Api/addCard';
import { removeCard } from '../Api/removeCard';

export function useCardContext() {
  const [state, setState] = useState({
    init: false,
    cards: new Map(),
  });
  const access = useRef(null);
  const revision = useRef(null);
  const next = useRef(null);
  const cards = useRef(new Map());

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const updateCards = async () => {
    let delta = await getCards(access.current, revision.current);
    for (let card of delta) {
      if (card.data) {
        let cur = cards.current.get(card.id);
        if (cur == null) {
          cur = { id: card.id, data: { articles: new Map() }, channels: new Map() }
        }
        if (cur.data.detailRevision != card.data.detailRevision) {
          if (card.data.cardDetail != null) {
            cur.data.cardDetail = card.data.cardDetail;
          }
          else {
            cur.data.cardDetail = await getCardDetail(access.current, card.id);
          }
          cur.data.detailRevision = card.data.detailRevision;
        }
        if (cur.data.profileRevision != card.data.profileRevision) {
          if (card.data.cardProfile != null) {
            cur.data.cardProfile = card.data.cardProfile;
          }
          else {
            cur.data.cardProfile = await getCardProfile(access.current, card.id);
          }
          cur.data.profileRevision = card.data.profileRevision;
        }
        const { cardDetail, cardProfile } = cur.data;
        if (cardDetail.status === 'connected') {
          if (cur.data.profileRevision != card.data.notifiedProfile) {
            let message = await getContactProfile(cardProfile.node, cardProfile.guid, cardDetail.token);
            await setCardProfile(access.current, card.id, message);

            // update remote profile
            cur.data.notifiedProfile = card.data.notifiedProfile;
          }
          if (cur.data.notifiedView != card.data.notifiedView) {
            // update remote articles and channels
            cur.data.articles = new Map();
            cur.channels = new Map();

            await updateContactChannels(card.id, cur.data.cardProfile.guid, cur.data.cardDetail.token, cur.data.notifiedView, cur.data.notifiedChannel, cur.channels);
            await updateContactArticles(card.id, cur.data.cardProfile.guid, cur.data.cardDetail.token, cur.data.notifiedView, cur.data.notifiedArticle, cur.data.articles);

            // update view
            cur.data.notifiedArticle = card.data.notifiedArticle;
            cur.data.notifiedChannel = card.data.notifiedChannel;
            cur.data.notifiedView = card.data.notifiedView;
          }
          if (cur.data.notifiedArticle != card.data.notifiedArticle) {
            // update remote articles
            await updateContactArticles(card.id, cur.data.cardProfile.guid, cur.data.cardDetail.token, cur.data.notifiedView, cur.data.notifiedArticle, cur.data.articles);
            cur.data.notifiedArticle = card.data.notifiedArticle;
          }
          if (cur.data.notifiedChannel != card.data.notifiedChannel) {
            // update remote channels
            await updateContactChannels(card.id, cur.data.cardProfile.guid, cur.data.cardDetail.token, cur.data.notifiedView, cur.data.notifiedChannel, cur.channels);
            cur.data.notifiedChannel = card.data.notifiedChannel;
          }
        }
        cur.revision = card.revision;
        cards.current.set(card.id, cur);
      }
      else {
        cards.current.delete(card.id);
      }
    }
  }

  const updateContactChannels = async (cardId, guid, token, viewRevision, channelRevision, channelMap) => {
    let delta = await getContactChannels(guid + "." + token, viewRevision, channelRevision);
    for (let channel of delta) {
      if (channel.data) {
        let cur = channelMap.get(channel.id);
        if (cur == null) {
          cur = { guid, cardId, id: channel.id, data: { } }
        }
        if (cur.data.detailRevision != channel.data.detailRevision) {
          if (channel.data.channelDetail != null) {
            cur.data.channelDetail = channel.data.channelDetail;
            cur.data.detailRevision = channel.data.detailRevision;
          }
          else {
            let slot = await getContactChannel(guid + "." + token, channel.id);
            cur.data.channelDetail = slot.data.channelDetail;
            cur.data.detailRevision = slot.data.detailRevision;
          }
        }
        cur.data.topicRevision = channel.data.topicRevision;
        cur.revision = channel.revision;
        channelMap.set(channel.id, cur);
      }
      else {
        channelMap.delete(channel.id);
      }
    }
  }

  const updateContactArticles = async (cardId, guid, token, viewRevision, articleRevision, articleMap) => {
    console.log("update contact articles");
  }

  const setCards = async (rev) => {
    if (next.current == null) {
      next.current = rev;
      if (revision.current != rev) {
        await updateCards();
        updateState({ init: true, cards: cards.current });
        revision.current = rev;
      }
      let r = next.current;
      next.current = null;
      if (revision.current != r) {
        setCards(r);
      }
    }
    else {
      next.current = rev;
    }
  }

  const getCardByGuid = (guid) => {
    let card = null;
    cards.current.forEach((value, key, map) => {
      if(value?.data?.cardProfile?.guid == guid) {
        card = value;
      }
    });
    return card;
  }

  const actions = {
    setToken: async (token) => {
      access.current = token;
    },
    setRevision: async (rev) => {
      setCards(rev);
    },
    getCardByGuid: getCardByGuid,
    getImageUrl: (cardId) => {
      let { data } = cards.current.get(cardId);
      return getCardImageUrl(access.current, cardId, data.profileRevision)
    },
    addChannelTopic: async (cardId, channelId, message, assets) => {
      let { cardProfile, cardDetail } = cards.current.get(cardId).data;
      let token = cardProfile.guid + '.' + cardDetail.token;
      let node = cardProfile.node;
      await addContactChannelTopic(node, token, channelId, message, assets);
    },
    getChannelRevision: (cardId, channelId) => {
      let card = cards.current.get(cardId);
      let channel = card.channels.get(channelId);
      return channel.revision;
    },
    getChannelTopics: async (cardId, channelId, revision) => {
      let card = cards.current.get(cardId);
      let node = card.data.cardProfile.node;
      let channel = card.channels.get(channelId);
      let token = card.data.cardProfile.guid + '.' + card.data.cardDetail.token;
      return await getContactChannelTopics(node, token, channelId, revision);
    },
    getChannelTopic: async (cardId, channelId, topicId) => {
      let card = cards.current.get(cardId);
      let node = card.data.cardProfile.node;
      let channel = card.channels.get(channelId);
      let token = card.data.cardProfile.guid + '.' + card.data.cardDetail.token;
      return await getContactChannelTopic(node, token, channelId, topicId);
    },
    addCard: async (message) => {
      return await addCard(access.current, message);
    },
    removeCard: async (cardId) => {
      return await removeCard(access.current, cardId);
    },
    setCardConnecting: async (cardId) => {
      return await setCardConnecting(access.current, cardId);
    },
    setCardConnected: async (cardId, token, view, article, channel, profile) => {
      return await setCardConnected(access.current, cardId, token, view, article, channel, profile);
    },
    setCardConfirmed: async (cardId) => {
      return await setCardConfirmed(access.current, cardId);
    },
    getCardOpenMessage: async (cardId) => {
      return await getCardOpenMessage(access.current, cardId);
    },
    setCardOpenMessage: async (server, message) => {
      return await setCardOpenMessage(server, message);
    },
    getCardCloseMessage: async (cardId) => {
      return await getCardCloseMessage(access.current, cardId);
    },
    setCardCloseMessage: async (server, message) => {
      return await setCardCloseMessage(server, message);
    },
  }

  return { state, actions }
}


