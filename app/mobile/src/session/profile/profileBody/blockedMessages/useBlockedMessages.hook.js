import { useState, useEffect, useContext } from 'react';
import { StoreContext } from 'context/StoreContext';
import { ChannelContext } from 'context/ChannelContext';
import { CardContext } from 'context/CardContext';
import { ProfileContext } from 'context/ProfileContext';
import { ConversationContext } from 'context/ConversationContext';
import moment from 'moment';

export function useBlockedMessages() {

  const [state, setState] = useState({
    messages: []
  });

  const store = useContext(StoreContext);
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const profile = useContext(ProfileContext);
  const conversation = useContext(ConversationContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const setItem = (item) => {
    let name, nameSet
    if (item.detail.guid === profile.state.identity.guid) {
      const identity = profile.state.identity;
      if (identity.name) {
        name = identity.name;
      }
      else {
        name = `${identity.handle}@${identity.node}`;
      }
      nameSet = true;
    }
    else {
      const contact = card.actions.getByGuid(item.detail.guid);
      if (contact) {
        if (contact?.profile?.name) {
          name = contact.profile.name;
        }
        else {
          name = `${contact.profile.handle}@${contact.profile.node}`;
        }
        nameSet = true;
      }
      else {
        name = 'unknown';
        nameSet = false;
      }
    }
    
    let timestamp;
    const date = new Date(item.detail.created * 1000);
    const now = new Date();
    const offset = now.getTime() - date.getTime();
    if(offset < 86400000) {
      timestamp = moment(date).format('h:mma');
    }
    else if (offset < 31449600000) {
      timestamp = moment(date).format('M/DD');
    }
    else {
      timestamp = moment(date).format('M/DD/YYYY');
    }

    const { cardId, channelId, topicId } = item;
    return { name, nameSet, timestamp, cardId, channelId, topicId, id: `${cardId}:${channelId}:${topicId}` };
  };

  const loadBlocked = async () => {
    const channelTopics = await channel.actions.getTopicBlocked();
    const cardChannelTopics = await card.actions.getChannelTopicBlocked();
    const topics = [ ...channelTopics, ...cardChannelTopics ];
    const sorted = topics.sort((a, b) => {
      const aTimestamp = a?.detail?.created;
      const bTimestamp = b?.detail?.created;
      if (aTimestamp === bTimestamp) {
        return 0;
      }
      if (aTimestamp == null || aTimestamp < bTimestamp) {
        return 1;
      }
      return -1;
    }); 
    updateState({ messages: sorted.map(setItem) });
  }

  useEffect(() => {
    loadBlocked();
  }, []);

  const actions = {
    unblock: async (cardId, channelId, topicId) => {
      const id = `${cardId}:${channelId}:${topicId}`;
      if (cardId) {
        card.actions.clearChannelTopicBlocked(cardId, channelId, topicId);
      }
      else {
        channel.actions.clearTopicBlocked(channelId, topicId);
      }
      conversation.actions.unblockTopic(cardId, channelId, topicId);
      updateState({ messages: state.messages.filter(item => item.id !== id) });
    }
  };

  return { state, actions };
}

