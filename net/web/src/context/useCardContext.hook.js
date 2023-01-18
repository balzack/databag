import { useState, useRef, useContext } from 'react';
import { getContactChannels } from 'api/getContactChannels';
import { getContactChannelDetail } from 'api/getContactChannelDetail';
import { getContactChannelSummary } from 'api/getContactChannelSummary';
import { getContactProfile } from 'api/getContactProfile';
import { setCardProfile } from 'api/setCardProfile';
import { getCards } from 'api/getCards';
import { getCardImageUrl } from 'api/getCardImageUrl';
import { getCardProfile } from 'api/getCardProfile';
import { getCardDetail } from 'api/getCardDetail';
import { removeContactChannel } from 'api/removeContactChannel';
import { removeContactChannelTopic } from 'api/removeContactChannelTopic';
import { setContactChannelTopicSubject } from 'api/setContactChannelTopicSubject';
import { addContactChannelTopic } from 'api/addContactChannelTopic';
import { setCardConnecting, setCardConnected, setCardConfirmed } from 'api/setCardStatus';
import { getCardOpenMessage } from 'api/getCardOpenMessage';
import { setCardOpenMessage } from 'api/setCardOpenMessage';
import { getCardCloseMessage } from 'api/getCardCloseMessage';
import { setCardCloseMessage } from 'api/setCardCloseMessage';
import { getContactChannelTopics } from 'api/getContactChannelTopics';
import { getContactChannelTopic } from 'api/getContactChannelTopic';
import { getContactChannelTopicAssetUrl } from 'api/getContactChannelTopicAssetUrl';
import { addCard } from 'api/addCard';
import { removeCard } from 'api/removeCard';
import { UploadContext } from 'context/UploadContext';

export function useCardContext() {
  const [state, setState] = useState({
    offsync: false,
    cards: new Map(),
  });
  const upload = useContext(UploadContext);
  const access = useRef(null);
  const syncing = useRef(false);
  const setRevision = useRef(null);
  const curRevision = useRef(null);
  const cards = useRef(new Map());
  const force = useRef(false);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

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
        const token = access.current;
        const card = cards.current.get(cardId);

        if (card.data.cardDetail.status === 'connected') {
          await syncCard(token, card);
        }
        card.offsync = false;
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
        const token = access.current;
        const revision = curRevision.current;
        const delta = await getCards(token, setRevision.current);
        for (let card of delta) {
          if (card.data) {
            let cur = cards.current.get(card.id);
            if (cur == null) {
              cur = { id: card.id, data: { articles: new Map() }, offsync: false, channels: new Map() }
            }
            if (cur.data.detailRevision !== card.data.detailRevision) {
              if (card.data.cardDetail != null) {
                cur.data.cardDetail = card.data.cardDetail;
              }
              else {
                cur.data.cardDetail = await getCardDetail(access.current, card.id);
              }
              cur.data.detailRevision = card.data.detailRevision;
            }
            if (cur.data.profileRevision !== card.data.profileRevision) {
              if (card.data.cardProfile != null) {
                cur.data.cardProfile = card.data.cardProfile;
              }
              else {
                cur.data.cardProfile = await getCardProfile(access.current, card.id);
              }
              cur.data.profileRevision = card.data.profileRevision;
            }

            if (cur.data.cardDetail.status === 'connected' && !cur.offsync) {
              cur.data.curNotifiedView = card.data.notifiedView;
              cur.data.curNotifiedProfile = card.data.notifiedProfile;
              cur.data.curNotifiedArticle = card.data.notifiedArticle;
              cur.data.curNotifiedChannel = card.data.notifiedChannel;
              try {
                await syncCard(token, cur);
              }
              catch (err) {
                console.log(err);
                cur.offsync = true;
              }
            }
            cards.current.set(card.id, cur);
          }
          else {
            cards.current.delete(card.id);
          }
        }

        setRevision.current = revision;
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
 
  const syncCard = async (token, card) => {
    const { cardProfile, cardDetail } = card.data;
    // sync profile
    if (card.data.setNotifiedProfile !== card.data.curNotifiedProfile) {
      if (card.data.profileRevision !== card.data.curNotifiedProfile) {
        const token = `${cardProfile.guid}.${cardDetail.token}`;
        const message = await getContactProfile(cardProfile.node, token);
        await setCardProfile(token, card.id, message);
      }
    }
    card.data.setNotifiedProfile = card.data.curNotifiedProfile;

    // sync channels & articles
    if (card.data.setNotifiedArticle !== card.data.curNotifiedArticle || card.data.setNotifiedView !== card.data.curNotifiedView) {
      await syncCardArticles(card);
    }
    if (card.data.setNotifiedChannel !== card.data.curNotifiedChannel || card.data.setNotifiedView !== card.data.curNotifiedView) {
      await syncCardChannels(card);
    }
    card.data.setNotifiedArticle = card.data.curNotifiedArticle;
    card.data.setNotifiedChannel = card.data.curNotifiedChannel;
    card.data.setNotifiedView = card.data.curNotifiedView;
    card.offsync = false;
  }

  const syncCardArticles = async (card) => {}

  const syncCardChannels = async (card) => {
    const { cardProfile, cardDetail, setNotifiedView, setNotifiedChannel } = card.data;
    const node = cardProfile.node;
    const token = `${cardProfile.guid}.${cardDetail.token}`;
    let delta;
    if (card.data.setNotifiedView !== card.data.curNotifiedView) {
      card.channels = new Map();
      delta = await getContactChannels(node, token);
    }
    else {
      delta = await getContactChannels(node, token, setNotifiedView, setNotifiedChannel);
    }
    for (let channel of delta) {
      if (channel.data) {
        let cur = card.channels.get(channel.id);
        if (cur == null) {
          cur = { id: channel.id, data: {} };
        }
        if (cur.data.detailRevision !== channel.data.detailRevision) {
          if (channel.data.channelDetail != null) {
            cur.data.channelDetail = channel.data.channelDetail;
          }
          else { 
            cur.data.channelDetail = await getContactChannelDetail(node, token, channel.id);
          }
          cur.data.detailRevision = channel.data.detailRevision;
        }
        if (cur.data.topicRevision !== channel.data.topicRevision) {
          if (channel.data.channelSummary != null) {
            cur.data.channelSummary = channel.data.channelSummary;
          }
          else {
            cur.data.channelSummary = await getContactChannelSummary(node, token, channel.id);
          }
          cur.data.topicRevision = channel.data.topicRevision;
        }
        cur.revision = channel.revision;
        card.channels.set(channel.id, cur);
      }
      else {  
        card.channels.delete(channel.id);
      }
    }
  }

  const actions = {
    setToken: (token) => {
      if (access.current || syncing.current) {
        throw new Error("invalid card session state");
      }
      access.current = token;
      cards.current = new Map();
      curRevision.current = null;
      setRevision.current = null;
      setState({ offsync: false, cards: new Map() });
    },
    clearToken: () => {
      access.current = null;
    },
    setRevision: async (rev) => {
      curRevision.current = rev;
      await sync();
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
    setCardConnected: async (cardId, token, rev) => {
      return await setCardConnected(access.current, cardId, token,
          rev.viewRevision, rev.articleRevision, rev.channelRevision, rev.profileRevision);
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
    getCardImageUrl: (cardId) => {
      const card = cards.current.get(cardId);
      if (card) {
        const revision = card.data.profileRevision;
        return getCardImageUrl(access.current, cardId, revision)
      }
    },
    removeChannel: async (cardId, channelId) => {
      let { cardProfile, cardDetail } = cards.current.get(cardId).data;
      let token = cardProfile.guid + '.' + cardDetail.token;
      let node = cardProfile.node;
      await removeContactChannel(node, token, channelId);
    },
    addTopic: async (cardId, channelId, type, message, files) => {
      let { cardProfile, cardDetail } = cards.current.get(cardId).data;
      let token = cardProfile.guid + '.' + cardDetail.token;
      let node = cardProfile.node;
      if (files?.length) {
        const topicId = await addContactChannelTopic(node, token, channelId, null, null, null);
        upload.actions.addContactTopic(node, token, cardId, channelId, topicId, files, async (assets) => {
          const subject = message(assets);
          await setContactChannelTopicSubject(node, token, channelId, topicId, type, subject);
        }, async () => {
          try {
            await removeContactChannelTopic(node, token, channelId, topicId);
          }
          catch(err) {
            console.log(err);
          }
        });
      }
      else {
        const subject = message([]);
        await addContactChannelTopic(node, token, channelId, type, subject, files);
      }
      resyncCard(cardId);
    },
    removeTopic: async (cardId, channelId, topicId) => {
      const card = cards.current.get(cardId);
      if (!card) {
        throw new Error('card not found');
      }
      const { cardProfile, cardDetail } = card.data;
      const token = cardProfile.guid + '.' + cardDetail.token;
      const node = cardProfile.node;
      await removeContactChannelTopic(node, token, channelId, topicId);
      resyncCard(cardId);
    },
    setTopicSubject: async (cardId, channelId, topicId, type, subject) => {
      const card = cards.current.get(cardId);
      if (!card) {
        throw new Error('card not found');
      }
      const { cardProfile, cardDetail } = card.data;
      const token = cardProfile.guid + '.' + cardDetail.token;
      const node = cardProfile.node;
      await setContactChannelTopicSubject(node, token, channelId, topicId, type, subject);
      resyncCard(cardId);
    },
    getTopicAssetUrl: (cardId, channelId, topicId, assetId) => {
      const card = cards.current.get(cardId);
      if (!card) {
        throw new Error('card not found');
      }
      const { cardProfile, cardDetail } = card.data;
      const token = cardProfile.guid + '.' + cardDetail.token;
      const node = cardProfile.node;
      return getContactChannelTopicAssetUrl(node, token, channelId, topicId, assetId);
    },
    getTopics: async (cardId, channelId, revision, count, begin, end) => {
      const card = cards.current.get(cardId);
      if (!card) {
        throw new Error('card not found');
      }
      const { cardProfile, cardDetail } = card.data;
      const token = cardProfile.guid + '.' + cardDetail.token;
      const node = cardProfile.node;
      return await getContactChannelTopics(node, token, channelId, revision, count, begin, end);
    },
    getTopic: async (cardId, channelId, topicId) => {
      const card = cards.current.get(cardId);
      if (!card) {
        throw new Error('card not found');
      }
      const { cardProfile, cardDetail } = card.data;
      const token = cardProfile.guid + '.' + cardDetail.token;
      const node = cardProfile.node;
      return await getContactChannelTopic(node, token, channelId, topicId);
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


