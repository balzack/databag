import { useEffect, useState, useRef, useContext } from 'react';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';

const defaultState = {
  offsync: false,
  topics: new Map(),
  card: null,
  channel: null,
  topicRevision: null,
};
export const defaultConversionContext = {
  state: defaultState,
  actions: {} as ReturnType<typeof useConversationContext>['actions'],
};
export function useConversationContext() {
  const COUNT = 32;

  const [state, setState] = useState(defaultState);

  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);

  const reset = useRef(false);
  const loadMore = useRef(false);
  const force = useRef(false);
  const syncing = useRef(false);
  const marker = useRef(null);
  const setTopicRevision = useRef(null);
  const curTopicRevision = useRef(null);
  const setDetailRevision = useRef(null);
  const curDetailRevision = useRef(null);
  const conversationId = useRef(null);
  const topics = useRef(new Map());

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  };

  const getTopicDelta = async (cardId, channelId, revision, count, begin, end) => {
    if (cardId) {
      return await card.actions.getTopics(cardId, channelId, revision, count, begin, end);
    }
    return await channel.actions.getTopics(channelId, revision, count, begin, end);
  };

  const getTopic = async (cardId, channelId, topicId) => {
    if (cardId) {
      return await card.actions.getTopic(cardId, channelId, topicId);
    }
    return await channel.actions.getTopic(channelId, topicId);
  };

  const removeChannel = async (cardId, channelId) => {
    if (cardId) {
      await card.actions.removeChannel(cardId, channelId);
      await card.actions.resync();
    } else {
      await channel.actions.removeChannel(channelId);
      await channel.actions.resync();
    }
  };

  const setChannelSubject = async (cardId, channelId, type, subject) => {
    if (cardId) {
      console.log('cannot update channel subject');
    } else {
      await channel.actions.setChannelSubject(channelId, type, subject);
    }
  };

  const setChannelCard = async (cardId, channelId, id) => {
    if (cardId) {
      console.log('cannot update channel card');
    } else {
      await channel.actions.setChannelCard(channelId, id);
      await channel.actions.resync();
    }
  };

  const clearChannelCard = async (cardId, channelId, id) => {
    if (cardId) {
      console.log('cannot update channel card');
    } else {
      await channel.actions.clearChannelCard(channelId, id);
      await channel.actions.resync();
    }
  };

  const addTopic = async (cardId, channelId, type, message, files) => {
    if (cardId) {
      await card.actions.addTopic(cardId, channelId, type, message, files);
    } else {
      await channel.actions.addTopic(channelId, type, message, files);
    }
    resync();
  };

  const removeTopic = async (cardId, channelId, topicId) => {
    if (cardId) {
      await card.actions.removeTopic(cardId, channelId, topicId);
    } else {
      await channel.actions.removeTopic(channelId, topicId);
    }
    await resync();
  };

  const setTopicSubject = async (cardId, channelId, topicId, type, subject) => {
    if (cardId) {
      await card.actions.setTopicSubject(cardId, channelId, topicId, type, subject);
    } else {
      await channel.actions.setTopicSubject(channelId, topicId, type, subject);
    }
    await resync();
  };

  const getTopicAssetUrl = (cardId, channelId, topicId, assetId) => {
    if (cardId) {
      return card.actions.getTopicAssetUrl(cardId, channelId, topicId, assetId);
    } else {
      return channel.actions.getTopicAssetUrl(channelId, topicId, assetId);
    }
  };

  const setChannelRevision = (cardId, channelId) => {
    let setChannel;
    if (cardId) {
      const setCard = card.state.cards.get(cardId);
      setChannel = setCard?.channels.get(channelId);
    } else {
      setChannel = channel.state.channels.get(channelId);
    }
    if (setChannel) {
      const { topicRevision, detailRevision } = setChannel.data;
      if (curTopicRevision.current !== topicRevision || curDetailRevision.current !== detailRevision) {
        curTopicRevision.current = topicRevision;
        curDetailRevision.current = detailRevision;
      }
    } else {
      console.log('conversation not found');
    }
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
    if (
      !syncing.current &&
      (reset.current ||
        force.current ||
        loadMore.current ||
        setDetailRevision.current !== curDetailRevision.current ||
        setTopicRevision.current !== curTopicRevision.current)
    ) {
      const more = loadMore.current;
      const update = force.current;
      const topicRevision = more ? setTopicRevision.current : curTopicRevision.current;
      const detailRevision = curDetailRevision.current;

      syncing.current = true;
      force.current = false;
      loadMore.current = false;

      if (reset.current) {
        reset.current = false;
        marker.current = null;
        setTopicRevision.current = null;
        setDetailRevision.current = null;
        topics.current = new Map();
        updateState({ offsync: false, channel: null, topics: new Map() });
      }

      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;

        // sync channel details
        if (setDetailRevision.current !== detailRevision) {
          let channelSync;
          let cardSync;
          if (cardId) {
            cardSync = card.state.cards.get(cardId);
            channelSync = cardSync?.channels.get(channelId);
          } else {
            channelSync = channel.state.channels.get(channelId);
          }
          if (channelSync) {
            setDetailRevision.current = detailRevision;
            updateState({ card: cardSync, channel: channelSync });
          } else {
            syncing.current = false;
            console.log('converstaion not found');
            return;
          }
        }

        try {
          // sync channel topics
          if (update || more || setTopicRevision.current !== topicRevision) {
            let delta;
            if (!marker.current) {
              delta = await getTopicDelta(cardId, channelId, null, COUNT, null, null);
            } else if (more) {
              delta = await getTopicDelta(cardId, channelId, null, COUNT, null, marker.current);
            } else {
              delta = await getTopicDelta(cardId, channelId, setTopicRevision.current, null, marker.current, null);
            }

            for (let topic of delta?.topics) {
              if (topic.data == null) {
                topics.current.delete(topic.id);
              } else {
                let cur = topics.current.get(topic.id);
                if (cur == null) {
                  cur = { id: topic.id, data: {} };
                }
                if (topic.data.detailRevision !== cur.data.detailRevision) {
                  if (topic.data.topicDetail) {
                    cur.data.topicDetail = topic.data.topicDetail;
                    cur.data.detailRevision = topic.data.detailRevision;
                  } else {
                    const slot = await getTopic(cardId, channelId, topic.id);
                    cur.data.topicDetail = slot.data.topicDetail;
                    cur.data.detailRevision = slot.data.detailRevision;
                  }
                }
                cur.revision = topic.revision;
                topics.current.set(topic.id, cur);
              }
            }

            marker.current = delta.marker ? delta.marker : marker.current;
            setTopicRevision.current = topicRevision;

            updateState({ offsync: false, topicRevision: topicRevision, topics: topics.current });
          }
        } catch (err) {
          console.log(err);
          updateState({ offsync: true });
          syncing.current = false;
          return;
        }

        syncing.current = false;
        await sync();
      }
    }
  };

  useEffect(() => {
    if (conversationId.current) {
      const { cardId, channelId } = conversationId.current;
      setChannelRevision(cardId, channelId);
      sync();
    }
    // eslint-disable-next-line
  }, [card.state, channel.state]);

  const actions = {
    setChannel: async (cardId, channelId) => {
      conversationId.current = { cardId, channelId };
      setChannelRevision(cardId, channelId);
      reset.current = true;
      await sync();
    },
    clearChannel: async () => {
      conversationId.current = null;
      curDetailRevision.current = null;
      curTopicRevision.current = null;
      reset.current = true;
      await sync();
    },
    removeChannel: async () => {
      const { cardId, channelId } = conversationId.current;
      await removeChannel(cardId, channelId);
    },
    setChannelSubject: async (type, subject) => {
      const { cardId, channelId } = conversationId.current;
      await setChannelSubject(cardId, channelId, type, subject);
    },
    setChannelCard: async (id) => {
      const { cardId, channelId } = conversationId.current;
      await setChannelCard(cardId, channelId, id);
    },
    clearChannelCard: async (id) => {
      const { cardId, channelId } = conversationId.current;
      await clearChannelCard(cardId, channelId, id);
    },
    addTopic: async (type, message, files) => {
      const { cardId, channelId } = conversationId.current;
      await addTopic(cardId, channelId, type, message, files);
    },
    removeTopic: async (topicId) => {
      const { cardId, channelId } = conversationId.current;
      await removeTopic(cardId, channelId, topicId);
    },
    setTopicSubject: async (topicId, type, subject) => {
      const { cardId, channelId } = conversationId.current;
      await setTopicSubject(cardId, channelId, topicId, type, subject);
    },
    getTopicAssetUrl: (assetId, topicId) => {
      const { cardId, channelId } = conversationId.current;
      return getTopicAssetUrl(cardId, channelId, topicId, assetId);
    },
    loadMore: async () => {
      loadMore.current = true;
      await sync();
    },
    resync: async () => {
      force.current = true;
      await sync();
    },
  };

  return { state, actions };
}
