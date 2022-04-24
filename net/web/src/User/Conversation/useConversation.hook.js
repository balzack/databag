import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../../AppContext/AppContext';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getChannelTopics } from '../../Api/getChannelTopics';
import { getChannelTopic } from '../../Api/getChannelTopic';
import { getContactChannelTopics } from '../../Api/getContactChannelTopics';
import { getContactChannelTopic } from '../../Api/getContactChannelTopic';
import { ConversationContext } from '../../ConversationContext/ConversationContext';

export function useConversation() {
  
  const [state, setState] = useState({
    topics: [],
  });

  const { card, channel } = useParams();
  const navigate = useNavigate();
  const app = useContext(AppContext);
  const conversation = useContext(ConversationContext);
  const topics = useRef(new Map());

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    close: () => {
      navigate('/user')
    },
  };

  const updateConversation = async () => {
    if (card) {
      if(app?.actions?.getCard) {
        let contact = app.actions.getCard(card);
        let conversation = contact.channels.get(channel);
        if (conversation?.revision != state.revision) {
          let token = contact.data.cardProfile.guid + "." + contact.data.cardDetail.token;
          let slots = await getContactChannelTopics(token, channel, state.revision);
          for (let topic of slots) {
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
                  let slot = await getContactChannelTopic(token, channel, topic.id);
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
            revision: conversation.revision,
          });
        }
      }
    }
    else {
      if(app?.actions?.getChannel) {
        let conversation = app.actions.getChannel(channel);
        if (conversation?.revision != state.revision) {
          let slots = await getChannelTopics(app.state.token, channel, state.revision);

          for (let topic of slots) {
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
                  let slot = await getChannelTopic(app.state.token, channel, topic.id);
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
        }
      }
    }
  }

  useEffect(() => {
    updateConversation();
  }, [app]);

  return { state, actions };
}
