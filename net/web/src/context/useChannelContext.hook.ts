import { useState, useRef, useContext } from 'react';
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
import { UploadContext } from 'context/UploadContext';

const defaultState = {
  offsync: false,
  channels: new Map(),
};
export const defaultChannelContext = {
  state: defaultState,
  actions: {} as ReturnType<typeof useChannelContext>['actions'],
};

export function useChannelContext() {
  const [state, setState] = useState(defaultState);
  const upload = useContext(UploadContext);
  const access = useRef(null);
  const setRevision = useRef(null);
  const curRevision = useRef(null);
  const channels = useRef(new Map());
  const syncing = useRef(false);
  const force = useRef(false);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  };

  const resync = async () => {
    try {
      force.current = true;
      await sync();
    } catch (err) {
      console.log(err);
    }
  };

  const sync = async () => {
    if (!syncing.current && (setRevision.current !== curRevision.current || force.current)) {
      syncing.current = true;
      force.current = false;

      try {
        const token = access.current;
        const revision = curRevision.current;
        const delta = await getChannels(token, setRevision.current);
        for (let channel of delta) {
          if (channel.data) {
            let cur = channels.current.get(channel.id);
            if (cur == null) {
              cur = { id: channel.id, data: {} };
            }
            if (cur.revision !== channel.revision) {
              if (cur.data.detailRevision !== channel.data.detailRevision) {
                if (channel.data.channelDetail != null) {
                  cur.data.channelDetail = channel.data.channelDetail;
                } else {
                  let detail = await getChannelDetail(token, channel.id);
                  cur.data.channelDetail = detail;
                }
                cur.data.detailRevision = channel.data.detailRevision;
              }
              if (cur.data.topicRevision !== channel.data.topicRevision) {
                if (channel.data.channelSummary != null) {
                  cur.data.channelSummary = channel.data.channelSummary;
                } else {
                  let summary = await getChannelSummary(token, channel.id);
                  cur.data.channelSummary = summary;
                }
                cur.data.topicRevision = channel.data.topicRevision;
              }
              cur.revision = channel.revision;
              channels.current.set(channel.id, cur);
            }
          } else {
            channels.current.delete(channel.id);
          }
        }
        setRevision.current = revision;
        updateState({ offsync: false, channels: channels.current });
      } catch (err) {
        console.log(err);
        syncing.current = false;
        updateState({ offsync: true });
        return;
      }

      syncing.current = false;
      await sync();
    }
  };

  const actions = {
    setToken: (token) => {
      if (access.current || syncing.current) {
        throw new Error('invalid channel session state');
      }
      access.current = token;
      channels.current = new Map();
      curRevision.current = null;
      setRevision.current = null;
      setState({ offsync: false, channels: new Map() });
    },
    clearToken: () => {
      access.current = null;
    },
    setRevision: async (rev) => {
      curRevision.current = rev;
      await sync();
    },
    addChannel: async (type, subject, cards) => {
      return await addChannel(access.current, type, cards, subject);
    },
    removeChannel: async (channelId) => {
      return await removeChannel(access.current, channelId);
    },
    setChannelSubject: async (channelId, type, subject) => {
      return await setChannelSubject(access.current, channelId, type, subject);
    },
    setChannelCard: async (channelId, cardId) => {
      return await setChannelCard(access.current, channelId, cardId);
    },
    clearChannelCard: async (channelId, cardId) => {
      return await clearChannelCard(access.current, channelId, cardId);
    },
    addTopic: async (channelId, type, message, files) => {
      if (files?.length) {
        const topicId = await addChannelTopic(access.current, channelId, null, null, null);
        upload.actions.addTopic(
          access.current,
          channelId,
          topicId,
          files,
          async (assets) => {
            const subject = message(assets);
            await setChannelTopicSubject(access.current, channelId, topicId, type, subject);
          },
          async () => {
            try {
              await removeChannelTopic(access.current, channelId, topicId);
            } catch (err) {
              console.log(err);
            }
          },
        );
      } else {
        const subject = message([]);
        await addChannelTopic(access.current, channelId, type, subject, undefined);
      }
      //await resync();
    },
    removeTopic: async (channelId, topicId) => {
      await removeChannelTopic(access.current, channelId, topicId);
      await resync();
    },
    setTopicSubject: async (channelId, topicId, type, subject) => {
      await setChannelTopicSubject(access.current, channelId, topicId, type, subject);
      await resync();
    },
    getTopicAssetUrl: (channelId, topicId, assetId) => {
      return getChannelTopicAssetUrl(access.current, channelId, topicId, assetId);
    },
    getTopics: async (channelId, revision, count, begin, end) => {
      return await getChannelTopics(access.current, channelId, revision, count, begin, end);
    },
    getTopic: async (channelId, topicId) => {
      return await getChannelTopic(access.current, channelId, topicId);
    },
    resync: async () => {
      await resync();
    },
  };

  return { state, actions };
}
