import { useEffect, useState, useRef } from 'react';
import { getChannels } from '../Api/getChannels';
import { getChannel } from '../Api/getChannel';
import { addChannel } from '../Api/addChannel';

export function useChannelContext() {
  const [state, setState] = useState({
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
            let slot = await getChannel(state.token, channel.id);
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
      if (revision.current != rev) {
        await updateChannels();
        updateState({ channels: channels.current });
        revision.current = rev;
      }
      if (next.current != null) {
        let r = next.current;
        next.current = null;
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
  }

  return { state, actions }
}


