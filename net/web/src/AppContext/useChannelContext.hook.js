import { useEffect, useState, useRef } from 'react';
import { getChannels } from '../Api/getChannels';
import { getChannel } from '../Api/getChannel';
import { addChannel } from '../Api/addChannel';
import { addChannelTopic } from '../Api/addChannelTopic';
import { getChannelTopics } from '../Api/getChannelTopics';
import { getChannelTopic } from '../Api/getChannelTopic';

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
            cur.data.detailRevision = channel.data.detailRevision;
          }
          else {
            let slot = await getChannel(access.current, channel.id);
            cur.data.channelDetail = slot.data.channelDetail;
            cur.data.detailRevision = slot.data.detailRevision;
          }
        }
        cur.data.topicRevision = channel.data.topicRevision;
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
    setRevision: async (rev) => {
      setChannels(rev);
    },
    addChannel: async (cards, subject, description) => {
      await addChannel(access.current, cards, subject, description);
    },
    addChannelTopic: async (channelId, message, assets) => {
      await addChannelTopic(access.current, channelId, message, assets);
    },
    getChannelRevision: (channelId) => {
      let channel = channels.current.get(channelId);
      return channel.revision;
    },
    getChannelTopics: async (channelId, revision) => {
      return await getChannelTopics(access.current, channelId, revision);
    },
    getChannelTopic: async (channelId, topicId) => {
      return await getChannelTopic(access.current, channelId, topicId);
    },
  }

  return { state, actions }
}


