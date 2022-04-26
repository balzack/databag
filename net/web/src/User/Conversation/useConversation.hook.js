import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ConversationContext } from '../../ConversationContext/ConversationContext';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';

export function useConversation() {
  
  const [state, setState] = useState({
    cardId: null,
    channelId: null,
    topics: [],
  });

  const { cardId, channelId } = useParams();
  const navigate = useNavigate();
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const conversation = useContext(ConversationContext);
  const topics = useRef(new Map());
  const revision = useRef(null);
  const id = useRef({});

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    close: () => {
      navigate('/user')
    },
  };

  const updateConversation = async () => {
    if (cardId) {
      let rev = card.actions.getChannelRevision(cardId, channelId);
      if (revision.current != rev) {
        let delta = await card.actions.getChannelTopics(cardId, channelId, revision.current);
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
          topics: Array.from(topics.current.values()), 
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
          topics: Array.from(topics.current.values()),
          revision: conversation.revision
        });
        revision.current = rev;
      }
    }
  }

  useEffect(() => {
    if (id.current.channelId != channelId || id.current.cardId) {
      id.current = { cardId, channelId };
      topics.current = new Map();
      revision.current = null;
      updateState({ cardId, channelId, topics: [] });
    }
    if (card.state.init && channel.state.init) {
      if (cardId) {
        if(card.state.cards.get(cardId)?.data.cardDetail.status != 'connected') {
          window.alert("You are no longer connected to the host");
          navigate('/user')
        }
      }
      try {
        updateConversation();
      }
      catch (err) {
        console.log(err);
      }
    }
  }, [card, channel, cardId, channelId]);

  return { state, actions };
}
