import { useEffect, useState, useRef, useContext } from 'react';
import SQLite from "react-native-sqlite-storage";

export function useTestStoreContext() {
  const [state, setState] = useState({});

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const channelRevision = useRef(0);
  const channels = useRef(new Map());

  const cardRevision = useRef(0);
  const cards = useRef(new Map());
  const cardChannels = useRef(new Map());

  const initSession = async (guid) => {
  }

  const actions = {
    init: async () => {
      return null;
    },
    updateDb: async () => {
    },
    setSession: async (access) => {
    },
    clearSession: async () => {
    },

    getProfile: async (guid) => {
      return state.profile;
    },
    setProfile: async (guid, profile) => {
      updateState({ profile });
    },
    getFirstRun: async (guid) => {
    },
    setFirstRun: async () => {
    },
    getAppValue: async (guid, key) => {
      return {};
    },
    setAppValue: async (guid, key, value) => {
    },
    getCardRequestStatus: async (guid) => {
    },
    setCardRequestStatus: async (guid, status) => {
    },
    getProfileRevision: async (guid) => {
      return state.profileRevision;
    },
    setProfileRevision: async (guid, revision) => {
      updateState({ profileRevision: revision });
    },

    getAccountStatus: async (guid) => {
    },
    setAccountStatus: async (guid, status) => {
    },
    getAccountSealKey: async (guid) => {
    },
    setAccountSealKey: async (guid, key) => {
    },
    getAccountRevision: async (guid) => {
    },
    setAccountRevision: async (guid, revision) => {
    }, 

    getCardRevision: async (guid) => {
      return cardRevision.current;
    },
    setCardRevision: async (guid, revision) => {
      cardRevision.current = revision;
    },
    setCardItem: async (guid, card) => {
      cards.current.set(card?.cardId, card)
    },
    clearCardItem: async (guid, cardId) => {
    },
    setCardItemRevision: async (guid, cardId, revision) => {
    },
    setCardItemNotifiedView: async (guid, cardId, notified) => {
    },
    setCardItemNotifiedArticle: async (guid, cardId, notified) => {
    },
    setCardItemNotifiedProfile: async (guid, cardId, notified) => {
    },
    setCardItemNotifiedChannel: async (guid, cardId, notified) => {
    },
    setCardItemOffsync: async (guid, cardId) => {
    },
    clearCardItemOffsync: async (guid, cardId) => {
    },
    setCardItemBlocked: async (guid, cardId) => {
    },
    clearCardItemBlocked: async (guid, cardId) => {
    },
    setCardItemDetail: async (guid, cardId, revision, detail) => {
    },
    setCardItemProfile: async (guid, cardId, revision, profile) => {
    },
    getCardItemStatus: async (guid, cardId) => {
    },
    getCardItemView: async (guid, cardId) => {
      return cards.current.get(cardId);
    },
    getCardItems: async (guid) => {
      return Array.from(cards.current.values());
    },

    getChannelRevision: async (guid) => {
      return channelRevision.current;
    },
    setChannelRevision: async (guid, revision) => {
      channelRevision.current = revision;
    }, 
    setChannelItem: async (guid, channel) => {
      channels.current.set(channel.channelId, channel);
    },
    clearChannelItem: async (guid, channelId) => {
      channels.current.delete(channelId);
    },
    setChannelItemRevision: async (guid, channelId, revision) => {
    },
    setChannelItemReadRevision: async (guid, channelId, revision) => {
    },
    setChannelItemSyncRevision: async (guid, channelId, revision) => {
    },
    setChannelItemTopicMarker: async (guid, channelId, marker) => {
    },
    setChannelItemMarkerAndSync: async (guid, channelId, marker, revision) => {
    },
    setChannelItemBlocked: async (guid, channelId) => {
    },
    clearChannelItemBlocked: async (guid, channelId) => {
    },
    setChannelItemDetail: async (guid, channelId, revision, detail) => {
    },
    setChannelItemUnsealedDetail: async (guid, channelId, revision, unsealed) => {
    },
    setChannelItemSummary: async (guid, channelId, revision, summary) => {
    },
    setChannelItemUnsealedSummary: async (guid, channelId, revision, unsealed) => {
    },
    getChannelItemView: async (guid, channelId) => {
      return channels.current.get(channelId);
    },
    getChannelItems: async (guid) => {
      return Array.from(channels.current.values())
    },

    getChannelTopicItems: async (guid, channelId) => {
      return [];
    },
    getChannelTopicItemsId: async (guid, channelId) => {
      return [];
    },
    getChannelTopicItemsById: async (guid, channelId, topcis) => {
      return [];
    },
    setChannelTopicItem: async (guid, channelId, topic) => { 
    },
    setChannelTopicItemUnsealedDetail: async (guid, channelId, topicId, revision, unsealed) => {
    },
    clearChannelTopicItem: async (guid, channelId, topicId) => {
    },
    clearChannelTopicItems: async (guid, channelId) => {
    },
    setChannelTopicBlocked: async (guid, channelId, topicId, blocked) => {
    },
    getChannelTopicBlocked: async (guid) => {
    },

    setCardChannelItem: async (guid, cardId, channel) => {
      const card = cardChannels.current.get(cardId) || new Map();
      card.set(channel.channelId, channel);
      cardChannels.current.set(cardId, card);
    },
    clearCardChannelItem: async (guid, cardId, channelId) => {
    },
    setCardChannelItemRevision: async (guid, cardId, channelId, revision) => {
    },
    setCardChannelItemReadRevision: async (guid, cardId, channelId, revision) => {
    },
    setCardChannelItemSyncRevision: async (guid, cardId, channelId, revision) => {
    },
    setCardChannelItemTopicMarker: async (guid, cardId, channelId, marker) => {
    },
    setCardChannelItemMarkerAndSync: async (guid, cardid, channelId, marker, revision) => {
    },
    setCardChannelItemDetail: async (guid, cardId, channelId, revision, detail) => {
    },
    setCardChannelItemUnsealedDetail: async (guid, cardId, channelId, revision, unsealed) => {
    },
    setCardChannelItemSummary: async (guid, cardId, channelId, revision, summary) => {
    },
    setCardChannelItemUnsealedSummary: async (guid, cardId, channelId, revision, unsealed) => {
    },
    getCardChannelItemView: async (guid, cardId, channelId) => {
    },
    getCardChannelItems: async (guid, cardId) => {
      const card = cardChannels.current.get(cardId) || new Map();
      return Array.from(card.values());
    },
    clearCardChannelItems: async (guid, cardId) => {
    },

    getCardChannelTopicItems: async (guid, cardId, channelId) => {
      return [];
    },
    getCardChannelTopicItemsId: async (guid, cardId, channelId) => {
      return [];
    },
    getCardChannelTopicItemsById: async (guid, cardId, channelId, topics) => {
      return [];
    }, 
    setCardChannelTopicItem: async (guid, cardId, channelId, topic) => {
    },
    setCardChannelTopicItemUnsealedDetail: async (guid, cardId, channelId, topicId, revision, unsealed) => {
    },
    clearCardChannelTopicItem: async (guid, cardId, channelId, topicId) => {
    },
    clearCardChannelTopicItems: async (guid, cardId, channelId) => {
    },
    setCardChannelTopicBlocked: async (guid, cardId, channelId, topicId, blocked) => {
    },
    getCardChannelTopicBlocked: async (guid) => {
    },
  }
  return { state, actions }
}

