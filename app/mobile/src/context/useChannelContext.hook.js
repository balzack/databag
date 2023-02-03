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
  const force = useRef(false);
  const store = useContext(StoreContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const setChannelItem = (channel) => {
    return {
      cardId: channel.id,
      revision: channel.revision,
      detailRevision: channel.data?.detailRevision,
      topicRevision: channel.data?.topicRevision,
      detail: channel.data?.channelDetail,
      summary: channel.data?.channelSummary,
    }
  }

  const setChannelField = (channelId, field, value) => {
    const channel = channels.get(channelId) || {};
    channel[field] = value;
    channels.set(channelId, { ...channel });
    updateState({ channels: channels.current }); 
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

  const sync = async () => {

    if (!syncing.current && (setRevision.current !== curRevision.current || force.current)) {
      syncing.current = true;
      force.current = false;

      try {
        const revision = curRevision.current;
        const { server, token, guid } = session.current;
        const delta = await getChannels(server, token, setRevision.current);
        for (let channel of delta) {
          if (channel.data) {
            const item = setChannelItem(channel);
            if (item.detail && item.summary) {
              await store.actions.setChannelItem(guid, item);
              channels.set(item.channelId, item);
            }
            else {
              const { channelId, detailRevision, topicRevision, detail, summary } = channel;
              const view = await store.actions.getChannelItemView(guid, channelId);
              if (view?.detailRevision !== detailRevision) {
                item.detail = await getChannelDetail(server, token, channelId);
                await store.actions.setChannelItemDetail(guid, channelId, detailRevision, item.detail);
              }
              if (view?.topicRevision !== topicRevision) {
                item.summary = await getChannelSummary(server, token, item.channelId);
                await store.actions.setChannelItemSummary(guid, channel.id, topicRevision, item.summary);
              }
              await store.actions.setChannelItem(guid, item);
              channels.set(channelId, item);
            }
          }
          else {
            await store.actions.clearChannelItem(guid, channel.id);
            channels.current.delete(channel.id);
          }
        }

        setRevision.current = revision;
        await store.actions.setChannelRevision(guid, revision);
        updateState({ channels: channels.current });
      }
      catch(err) {
        console.log(err);
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
    clearToken: () => {
      access.current = null;
    },
    setRevision: async (rev) => {
      curRevision.current = rev;
      await sync();
    },
    addChannel: async (type, subject, cards) => {
      const { server, token } = access.current;
      return await addChannel(server, token, type, subject, cards);
    },
    removeChannel: async (channelId) => {
      const { server, token } = access.current;
      return await removeChannel(access.current, channelId);
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
      const { server, token } = session.current;
      if (files?.length > 0) {
        const topicId = await addChannelTopic(server, token, channelId, null, null, null);
        upload.actions.addTopic(server, token, channelId, topicId, files, async (assets) => {
          message.assets = assets;
          const subject = message(assets);
          await setChannelTopicSubject(server, token, channelId, topicId, type, sbuject);
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

    getTopics: async (channelId) => {
      const { guid } = session.current;
      return await store.actions.getChannelTopicItems(guid, channelId); 
    },

    resync: async () => {
      await resync();
    },

    setReadRevision: async (channelId, revision) => {
      const { guid } = access.current;
      await store.actions.setChannelItemReadRevision(guid, channelId, revision);
      setChannelField(channelId, 'readRevision', revision);
    },
    setSyncRevision: async (channelId, revision) => {
      const { guid } = session.current;
      await store.actions.setChannelItemSyncRevision(guid, channelId, revision);
      setChannelField(channelId, 'syncRevision', revision);
    },
    setTopicMarker: async (channelId, marker) => {
      const { guid } = session.current;
      await store.actions.setChannelItemTopicMarker(guid, channelId, revision);
      setChannelField(channelId, 'topicMarker', marker);
    },
    setChannelFlag: async (channelId) => {
      const { guid } = session.current;
      await store.actions.setChannelItemBlocked(guid, channelId);
      setChannelField(channelId, 'blocked', true);
    },
    clearChannelFlag: async (channelId) => {
      const { guid } = session.current;
      await store.actions.clearChannelItemBlocked(guid, channelId);
      setChannelField(channelId, 'blocked', false);
    },
    setTopicFlag: async (channelId, topicId) => {
      const { guid } = session.current;
      await store.actions.setChannelTopicBlocked(guid, channelId, topicId, true);
    },
    clearTopicFlag: async (channelId, topicId) => {
      const { guid } = session.current;
      await store.actions.setChannelTopicBlocked(guid, channelId, topicId, false);
    },
    addChannelAlert: async (channelId) => {
      const { server, guid } = session.current;
      return await addFlag(server, guid, channelId);
    },
    addTopicAlert: async (channelId, topicId) => {
      const { server, guid } = session.current;
      return await addFlag(server, guid, channelId, topicId);
    },
    getTopicItems: async (channelId, revision, count, begin, end) => {
      const { server, token } = session.current;
      return await getChannelTopics(server, token, channelId, revision, count, begin, end);
    },
    getTopicItem: async (channelId, topicId) => {
      const { server, token } = session.current;
      return await getChannelTopic(server, token, channelId, topicId);
    },
    setTopicItem: async (channelId, topic) => {
      const { guid } = session.current;
      return await store.actions.setChannelTopicItem(guid, channelId, topic);
    },
    clearTopicItem: async (channelId, topicId) => {
      const { guid } = session.current;
      return await store.actions.clearChannelTopicItem(guid, channelId, topicId);
    },
    setUnsealedChannelSubject: async (channelId, revision, unsealed) => {
      const { guid } = session.current;
      await store.actions.setChannelItemUnsealedDetail(guid, channelId, revision, unsealed);
    },
    setUnsealedChannelSummary: async (channelId, revision, unsealed) => {
      const { guid } = session.current;
      await store.actions.setChannelItemUnsealedSummary(guid, channelId, revision, unsealed);
    },
    setUnsealedTopicSubject: async (channelId, topicId, revision, unsealed) => {
      const { guid } = session.current;
      await store.actions.setChannelTopicItemUnsealedDetail(guid, channelId, topicId, revision, unsealed);
    },
  };

  return { state, actions }
}

