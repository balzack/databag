import { useEffect, useState, useRef, useContext } from 'react';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';

export function useConversationContext() {

  const [state, setState] = useState({
    init: false,
    topics: new Map(),
  });

  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const topics = useRef(new Map());
  const revision = useRef(null);
  const conversationId = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }  

  const setTopics = async () => {
    const { cardId, channelId } = conversationId.current;
    
    if (cardId) {
      let rev = card.actions.getChannelRevision(cardId, channelId);
      if (revision.current != rev) {
        let delta = await card.actions.getChannelTopics(cardId, channelId, revision.current);
    console.log(delta);
        for (let topic of delta) {
          if (topic.data == null) {
            topics.current.delete(topic.id);
          }
          else {
            let cur = topics.current.get(topic.id);
            if (cur == null) {
              cur = { id: topic.id, data: {} };
            }
            if (topic.data.detailRevision != cur.data.detailRevision) {
              if(topic.data.topicDetail != null) {
                cur.data.topicDetail = topic.data.topicDetail;
                cur.data.detailRevision = topic.data.detailRevision;
              }
              else {
                let slot = await card.actions.getChannelTopic(cardId, channelId, topic.id);
                cur.data.topicDetail = slot.data.topicDetail;
                cur.data.detailRevision = slot.data.detailRevision;
              }
            }
            cur.revision = topic.revision;
            topics.current.set(topic.id, cur);
          }
        }
        updateState({
          init: true,
          topics: topics.current,
        });
        revision.current = rev;
      }
    }
    else {
      let rev = channel.actions.getChannelRevision(channelId);
      if (revision.current != rev) {
        let delta = await channel.actions.getChannelTopics(channelId, revision.current);
        for (let topic of delta) {
          if (topic.data == null) {
            topics.current.delete(topic.id);
          }
          else {
            let cur = topics.current.get(topic.id);
            if (cur == null) {
              cur = { id: topic.id, data: {} };
            }
            if (topic.data.detailRevision != cur.data.detailRevision) {
              if(topic.data.topicDetail != null) {
                cur.data.topicDetail = topic.data.topicDetail;
                cur.data.detailRevision = topic.data.detailRevision;
              }
              else {
                let slot = await channel.actions.getChannelTopic(channelId, topic.id);
                cur.data.topicDetail = slot.data.topicDetail;
                cur.data.detailRevision = slot.data.detailRevision;
              }
            }
            cur.revision = topic.revision;
            topics.current.set(topic.id, cur);
          }
        }
        updateState({
          init: true,
          topics: topics.current,
        });
        revision.current = rev;
      }
    }
  }

  const updateConversation = async () => {

    if (!card.state.init || !channel.state.init) {
      return;
    }

    const { cardId } = conversationId.current;
    if (cardId && card.state.cards.get(cardId)?.data.cardDetail.status != 'connected') {
      window.alert("You are disconnected from the host");
      conversationId.current = null;
      return;
    }

    try {
      setTopics();
    }
    catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (conversationId.current != null) {
      updateConversation();
    }
  }, [card, channel]);

  const actions = {
    setConversationId: (cardId, channelId) => {
      conversationId.current = { cardId, channelId };
      revision.current = null;
      topics.current = new Map();
      updateState({ init: false, topics: topics.current });
      updateConversation();
    }
  }

  return { state, actions }
}


