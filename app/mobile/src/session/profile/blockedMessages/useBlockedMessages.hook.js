import { useState, useEffect, useContext } from 'react';
import { StoreContext } from 'context/StoreContext';
import { ChannelContext } from 'context/ChannelContext';
import { CardContext } from 'context/CardContext';
import { ProfileContext } from 'context/ProfileContext';
import { getCardByGuid } from 'context/cardUtil'; 
import moment from 'moment';

export function useBlockedMessages() {

  const [state, setState] = useState({
    messages: []
  });

  const store = useContext(StoreContext);
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const profile = useContext(ProfileContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const setTopicItem = (cardId, channelId, topic) => {
    let name, nameSet
    if (topic.detail.guid === profile.state.identity.guid) {
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
      const contact = getCardByGuid(card.state.cards, topic.detail.guid);
      if (contact) {
        if (contact?.card?.profile?.name) {
          name = contact.card.profile.name;
        }
        else {
          name = `${contact.card.profile.handle}@${contact.card.profile.node}`;
        }
        nameSet = true;
      }
      else {
        name = 'unknown';
        nameSet = false;
      }
    }
    
    let timestamp;
    const date = new Date(topic.detail.created * 1000);
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

    const { topicId } = topic;
    return { name, nameSet, timestamp, cardId, channelId, topicId, id: `${cardId}:${channelId}:${topicId}` };
  };

  const loadBlocked = async () => {
    const channels = [];
    channel.state.channels.forEach((channelItem, channelId, map) => {
      channels.push({ channelId });
    });
    card.state.cards.forEach((cardItem, cardId, map) => {
      cardItem.channels.forEach((channelItem, channelId, map) => {
        channels.push({ cardId, channelId });
      });
    });

    for(let i = 0; i < channels.length; i++) {
      const merged = [];
      let topics;
      const { cardId, channelId } = channels[i];
      if (cardId) {
        topics = await card.actions.getTopicItems(cardId, channelId);
      }
      else {
        topics = await channel.actions.getTopicItems(channelId);
      }
      topics.forEach((topic) => {
        if (topic.blocked) {
          merged.push(setTopicItem(cardId, channelId, topic));
        }
      });
    }

    updateState({ messages: merged });
  };

  useEffect(() => {
    loadBlocked(); 
  }, []);

  const actions = {
    unblock: async (cardId, channelId, topicId) => {
      const id = `${cardId}:${channelId}:${topicId}`;
      if (cardId) {
        card.actions.clearChannelTopicFlag(cardId, channelId, topicId);
      }
      else {
        channel.actions.clearTopicFlag(channelId, topicId);
      }
      updateState({ messages: state.messages.filter(item => item.id !== id) });
    }
  };

  return { state, actions };
}

