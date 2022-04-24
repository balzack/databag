import { useEffect, useState, useRef } from 'react';
import { getContactChannels } from '../Api/getContactChannels';
import { getContactChannel } from '../Api/getContactChannel';
import { getContactProfile } from '../Api/getContactProfile';
import { setCardProfile } from '../Api/setCardProfile';
import { getCards } from '../Api/getCards';
import { getCardImageUrl } from '../Api/getCardImageUrl';
import { getCardProfile } from '../Api/getCardProfile';
import { getCardDetail } from '../Api/getCardDetail';

export function useCardContext() {
  const [state, setState] = useState({
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

            let contactToken = cur.data.cardProfile.guid + "." + cur.data.cardDetail.token
            await updateContactChannels(contactToken, cur.data.notifiedView, cur.dataNotifiedChannel, cur.channels);
            await updateContactArticles(contactToken, cur.data.notifiedView, cur.dataNotifiedArticle, cur.data.articles);

            // update view
            cur.data.notifiedArticle = card.data.notifiedArticle;
            cur.data.notifiedChannel = card.data.notifiedChannel;
            cur.data.notifiedView = card.data.notifiedView;
          }
          if (cur.data.notifiedArticle != card.data.notifiedArticle) {
            // update remote articles
            let contactToken = cur.data.cardProfile.guid + "." + cur.data.cardDetail.token
            await updateContactArticles(contactToken, cur.data.notifiedView, cur.dataNotifiedArticle, cur.data.articles);
            cur.data.notifiedArticle = card.data.notifiedArticle;
          }
          if (cur.data.notifiedChannel != card.data.notifiedChannel) {
            // update remote channels
            let contactToken = cur.data.cardProfile.guid + "." + cur.data.cardDetail.token
            await updateContactChannels(contactToken, cur.data.notifiedView, cur.dataNotifiedChannel, cur.channels);
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

  const updateContactChannels = async (token, viewRevision, channelRevision, channelMap) => {
    let delta = await getContactChannels(token, viewRevision, channelRevision);
    for (let channel of delta) {
      if (channel.data) {
        let cur = channelMap.get(channel.id);
        if (cur == null) {
          cur = { id: channel.id, data: { } }
        }
        if (cur.data.detailRevision != channel.data.detailRevision) {
          if (channel.data.channelDetail != null) {
            cur.data.channelDetail = channel.data.channelDetail;
            cur.data.detailRevision = channel.data.detailRevision;
          }
          else {
            let slot = await getContactChannel(token, channel.id);
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

  const updateContactArticles = async (token, viewRevision, articleRevision, articleMap) => {
    console.log("update contact articles");
  }

  const setCards = async (rev) => {
    if (next.current == null) {
      await updateCards();
      updateState({ cards: cards.current });
      revision.current = rev;
      if (next.current != null) {
        let r = next.current;
        next.current = null;
        setCards(r);
      }
    }
    else {
      next.current = rev;
    }
  }

  const actions = {
    setToken: async (token) => {
      access.current = token;
    },
    setRevision: async (rev) => {
      setCards(rev);
    },
  }

console.log(state);

  return { state, actions }
}


