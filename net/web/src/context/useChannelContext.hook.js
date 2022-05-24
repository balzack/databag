import { useEffect, useState, useRef } from 'react';
import { getChannels } from 'api/getChannels';
import { getChannelDetail } from 'api/getChannelDetail';
import { getChannelSummary } from 'api/getChannelSummary';
import { addChannel } from 'api/addChannel';
import { removeChannel } from 'api/removeChannel';
import { addChannelTopic } from 'api/addChannelTopic';
import { getChannelTopics } from 'api/getChannelTopics';
import { getChannelTopic } from 'api/getChannelTopic';
import { getChannelTopicAssetUrl } from 'api/getChannelTopicAssetUrl';
import { setChannelSubject } from 'api/setChannelSubject';
import { setChannelCard } from 'api/setChannelCard';
import { clearChannelCard } from 'api/clearChannelCard';
export function useChannelContext() {
  const [state, setState] = useState({
    init: false,
    channels: new Map(),
  });
  const access = useRef(null);
  const revision = useRef(null);
  const channels = useRef(new Map());
  const next = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const updateChannels = async () => {
    let delta = await getChannels(access.current, revision.current);
    for (let channel of delta) {
      if (channel.data) {
        let cur = channels.current.get(channel.id);
        if (cur == null) {
          cur = { id: channel.id, data: { } }
        }
        if (cur.data.detailRevision != channel.data.detailRevision) {
          if (channel.data.channelDetail != null) {
            cur.data.channelDetail = channel.data.channelDetail;
          }
          else {
            let detail = await getChannelDetail(access.current, channel.id);
            cur.data.channelDetail = detail;
          }
          cur.data.detailRevision = channel.data.detailRevision;
        }
        if (cur.data.topicRevision != channel.data.topicRevision) {
          if (channel.data.channelSummary != null) {
            cur.data.channelSummary = channel.data.channelSummary;
          }
          else {
            let summary = await getChannelSummary(access.current, channel.id);
            cur.data.channelSummary = summary;
          }
          cur.data.topicRevision = channel.data.topicRevision;
        }
        cur.revision = channel.revision;
        channels.current.set(channel.id, cur);
      }
      else {
        channels.current.delete(channel.id);
      }
    }
  }

  const setChannels = async (rev) => {
    if (next.current == null) {
      next.current = rev;
      if (revision.current != rev) {
        await updateChannels();
        updateState({ init: true, channels: channels.current });
        revision.current = rev;
      }
      let r = next.current;
      next.current = null;
      if (revision.current != r) {
        setChannels(r);
      }
    }
    else {
      next.current = rev;
    }
  }

  const actions = {
    setToken: (token) => {
      access.current = token;
    },
    clearToken: () => {
      access.current = null;
      channels.current = new Map();
      revision.current = null;
      setState({ init: false, channels: new Map() });
    },
    setRevision: async (rev) => {
      setChannels(rev);
    },
    addChannel: async (cards, subject, description) => {
      return await addChannel(access.current, cards, subject, description);
    },
    setChannelSubject: async (channelId, subject) => {
      return await setChannelSubject(access.current, channelId, subject);
    },
    setChannelCard: async (channelId, cardId) => {
      return await setChannelCard(access.current, channelId, cardId);
    },
    clearChannelCard: async (channelId, cardId) => {
      return await clearChannelCard(access.current, channelId, cardId);
    },
    removeChannel: async (channelId) => {
      return await removeChannel(access.current, channelId);
    },
    addChannelTopic: async (channelId, message, assets) => {
      await addChannelTopic(access.current, channelId, message, assets);
    },
    getChannel: (channelId) => {
      return channels.current.get(channelId);
    },
    getChannelRevision: (channelId) => {
      let channel = channels.current.get(channelId);
      return channel?.revision;
    },
    getChannelTopics: async (channelId, revision) => {
      return await getChannelTopics(access.current, channelId, revision);
    },
    getChannelTopic: async (channelId, topicId) => {
      return await getChannelTopic(access.current, channelId, topicId);
    },
    getChannelTopicAssetUrl: (channelId, topicId, assetId) => {
      return getChannelTopicAssetUrl(access.current, channelId, topicId, assetId);
    }
  }

  return { state, actions }
}


