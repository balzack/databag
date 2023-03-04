import { useState, useRef, useContext } from 'react';
import { StoreContext } from 'context/StoreContext';
import { UploadContext } from 'context/UploadContext';
import { getChannels } from 'api/getChannels';
import { getChannelDetail } from 'api/getChannelDetail';
import { getChannelSummary } from 'api/getChannelSummary';
import { addChannel } from 'api/addChannel';
import { removeChannel } from 'api/removeChannel';
import { removeChannelTopic } from 'api/removeChannelTopic';
import { setChannelTopicSubject } from 'api/setChannelTopicSubject';
import { addChannelTopic } from 'api/addChannelTopic';
import { getChannelTopics } from 'api/getChannelTopics';
import { getChannelTopic } from 'api/getChannelTopic';
import { getChannelTopicAssetUrl } from 'api/getChannelTopicAssetUrl';
import { setChannelSubject } from 'api/setChannelSubject';
import { setChannelCard } from 'api/setChannelCard';
import { clearChannelCard } from 'api/clearChannelCard';
import { addFlag } from 'api/addFlag';
import { setChannelNotifications } from 'api/setChannelNotifications';
import { getChannelNotifications } from 'api/getChannelNotifications';

export function useChannelContext() {
  const [state, setState] = useState({
    offsync: false,
    channels: new Map(),
  });
  const upload = useContext(UploadContext);
  const access = useRef(null);
  const setRevision = useRef(null);
  const curRevision = useRef(null);
  const channels = useRef(new Map());
  const syncing = useRef(false);
  const store = useContext(StoreContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const setChannelItem = (channel) => {
    return {
      channelId: channel.id,
      revision: channel.revision,
      detailRevision: channel.data?.detailRevision,
      topicRevision: channel.data?.topicRevision,
      detail: channel.data?.channelDetail,
      summary: channel.data?.channelSummary,
    }
  }

  const setChannelField = (channelId, field, value, field2, value2) => {
    const channel = channels.current.get(channelId) || {};
    channel[field] = value;
    if (field2) {
      channel[field2] = value2;
    }
    channels.current.set(channelId, { ...channel });
    updateState({ channels: channels.current }); 
  };

  const sync = async () => {
  
    if (access.current && !syncing.current && setRevision.current !== curRevision.current) {
      syncing.current = true;
      try {
        const revision = curRevision.current;
        const { server, token, guid } = access.current;
        const delta = await getChannels(server, token, setRevision.current);
        for (let channel of delta) {
          if (channel.data) {
            const item = setChannelItem(channel);
            const entry = channels.current.get(channel.id);
            if (!entry) {
              if (!item.detail) {
                item.detail = await getChannelDetail(server, token, channel.id);
              }
              if (!item.summary) {
                item.summary = await getChannelSummary(server, token, channel.id);
              }
              await store.actions.setChannelItem(guid, item);
              channels.current.set(channel.id, item);
            }
            else {
              if (item.detailRevision !== entry.detailRevision) {
                entry.detail = await getChannelDetail(server, token, channel.id);
                entry.unsealedDetail = null;
                entry.detailRevision = item.detailRevision;
                await store.actions.setChannelItemDetail(guid, channel.id, entry.detailRevision, entry.detail);
              }
              if (item.topicRevision !== entry.topicRevision) {
                entry.summary = await getChannelSummary(server, token, channel.id);
                entry.unsealedSummary = null;
                entry.topicRevision = item.topicRevision;
                await store.actions.setChannelItemSummary(guid, channel.id, entry.topicRevision, entry.summary);
              }
              channels.current.set(channel.id, { ...entry });
            }
          }
          else {
            await store.actions.clearChannelItem(guid, channel.id);
            channels.current.delete(channel.id);
          }
        }

        setRevision.current = revision;
        await store.actions.setChannelRevision(guid, revision);
        updateState({ offsync: false, channels: channels.current });
      }
      catch(err) {
        console.log(err);
        updateState({ offsync: true });
        syncing.current = false;
        return;
      }

      syncing.current = false;
      sync();
    }
  };

  const actions = {
    setSession: async (session) => {
      if (access.current || syncing.current) {
        throw new Error('invalid channel state');
      }
      access.current = session;
      channels.current = new Map();
      const items = await store.actions.getChannelItems(session.guid);
      
      for(item of items) {
        channels.current.set(item.channelId, item);
      }
      const revision = await store.actions.getChannelRevision(session.guid);
      curRevision.current = revision;
      setRevision.current = revision;
      setState({ offsync: false, channels: channels.current });
    },
    clearSession: () => {
      access.current = null;
    },
    setRevision: (rev) => {
      curRevision.current = rev;
      sync();
    },
    addChannel: async (type, subject, cards) => {
      const { server, token } = access.current;
      return await addChannel(server, token, type, subject, cards);
    },
    removeChannel: async (channelId) => {
      const { server, token } = access.current;
      return await removeChannel(server, token, channelId);
    },
    setChannelSubject: async (channelId, type, subject) => {
      const { server, token } = access.current;
      return await setChannelSubject(server, token, channelId, type, subject);
    },
    setChannelCard: async (channelId, cardId) => {
      const { server, token } = access.current;
      return await setChannelCard(server, token, channelId, cardId);
    },
    clearChannelCard: async (channelId, cardId) => {
      const { server, token } = access.current;
      return await clearChannelCard(server, token, channelId, cardId);
    },
    addTopic: async (channelId, type, message, files) => {
      const { server, token } = access.current;
      if (files?.length > 0) {
        const topicId = await addChannelTopic(server, token, channelId, null, null, null);
        upload.actions.addTopic(server, token, channelId, topicId, files, async (assets) => {
          const subject = message(assets);
          await setChannelTopicSubject(server, token, channelId, topicId, type, subject);
        }, async () => {
          try {
            await removeChannelTopic(server, token, channelId, topicId);
          }
          catch (err) {
            console.log(err);
          }
        });
      }
      else {
        const subject = message([]);
        await addChannelTopic(server, token, channelId, type, subject, []);
      }
    },
    removeTopic: async (channelId, topicId) => {
      const { server, token } = access.current;
      await removeChannelTopic(server, token, channelId, topicId);
    },
    setTopicSubject: async (channelId, topicId, type, subject) => {
      const { server, token } = access.current;
      await setChannelTopicSubject(server, token, channelId, topicId, type, subject);
    },
    getTopicAssetUrl: (channelId, topicId, assetId) => {
      const { server, token } = access.current;
      getChannelTopicAssetUrl(server, token, channelId, topicId, assetId);
    },
    getTopics: async (channelId, revision, count, begin, end) => {
      const { server, token } = access.current;
      return await getChannelTopics(server, token, channelId, revision, count, begin, end);
    },
    getTopic: async (channelId, topicId) => {
      const { server, token } = access.current;
      return await getChannelTopic(server, token, channelId, topicId);
    },
    resync: async () => {
      await sync();
    },
    getNotifications: async (channelId) => {
      const { server, token } = access.current;
      return await getChannelNotifications(server, token, channelId);
    },
    setNotifications: async (channelId, notify) => {
      const { server, token } = access.current;
      return await setChannelNotifications(server, token, channelId, notify);
    },
    setReadRevision: async (channelId, revision) => {
      const { guid } = access.current;
      await store.actions.setChannelItemReadRevision(guid, channelId, revision);
      setChannelField(channelId, 'readRevision', revision);
    },
    setSyncRevision: async (channelId, revision) => {
      const { guid } = access.current;
      await store.actions.setChannelItemSyncRevision(guid, channelId, revision);
      setChannelField(channelId, 'syncRevision', revision);
    },
    setTopicMarker: async (channelId, marker) => {
      const { guid } = access.current;
      await store.actions.setChannelItemTopicMarker(guid, channelId, revision);
      setChannelField(channelId, 'topicMarker', marker);
    },
    setMarkerAndSync: async (channelId, marker, revision) => {
      const { guid } = access.current;
      await store.actions.setChannelItemMarkerAndSync(guid, channelId, marker, revision);
      setChannelField(channelId, 'topicMarker', marker, 'syncRevision', revision);
    },
    setChannelFlag: async (channelId) => {
      const { guid } = access.current;
      await store.actions.setChannelItemBlocked(guid, channelId);
      setChannelField(channelId, 'blocked', true);
    },
    clearChannelFlag: async (channelId) => {
      const { guid } = access.current;
      await store.actions.clearChannelItemBlocked(guid, channelId);
      setChannelField(channelId, 'blocked', false);
    },
    setTopicFlag: async (channelId, topicId) => {
      const { guid } = access.current;
      await store.actions.setChannelTopicBlocked(guid, channelId, topicId, 1);
    },
    clearTopicFlag: async (channelId, topicId) => {
      const { guid } = access.current;
      await store.actions.setChannelTopicBlocked(guid, channelId, topicId, 0);
    },
    addChannelAlert: async (channelId) => {
      const { server, guid } = access.current;
      return await addFlag(server, guid, channelId);
    },
    addTopicAlert: async (channelId, topicId) => {
      const { server, guid } = access.current;
      return await addFlag(server, guid, channelId, topicId);
    },
    getTopicItems: async (channelId) => {
      const { guid } = access.current;
      return await store.actions.getChannelTopicItems(guid, channelId); 
    },
    setTopicItem: async (channelId, topic) => {
      const { guid } = access.current;
      return await store.actions.setChannelTopicItem(guid, channelId, topic);
    },
    clearTopicItem: async (channelId, topicId) => {
      const { guid } = access.current;
      return await store.actions.clearChannelTopicItem(guid, channelId, topicId);
    },
    setUnsealedChannelSubject: async (channelId, revision, unsealed) => {
      const { guid } = access.current;
      await store.actions.setChannelItemUnsealedDetail(guid, channelId, revision, unsealed);
      setChannelField(channelId, 'unsealedDetail', unsealed);
    },
    setUnsealedChannelSummary: async (channelId, revision, unsealed) => {
      const { guid } = access.current;
      await store.actions.setChannelItemUnsealedSummary(guid, channelId, revision, unsealed);
      setChannelField(channelId, 'unsealedSummary', unsealed);
    },
    setUnsealedTopicSubject: async (channelId, topicId, revision, unsealed) => {
      const { guid } = access.current;
      await store.actions.setChannelTopicItemUnsealedDetail(guid, channelId, topicId, revision, unsealed);
    },
  };

  return { state, actions }
}

