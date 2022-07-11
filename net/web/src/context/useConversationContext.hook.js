import { useEffect, useState, useRef, useContext } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';

export function useConversationContext() {
  const TOPIC_BATCH = 32;

  const [state, setState] = useState({
    init: false,
    loading: false,
    cardId: null,
    channelId: null,
    subject: null,
    contacts: null,
    members: new Set(),
    topics: new Map(),
    revision: null,
  });

  const EVENT_OPEN = 1;
  const EVENT_MORE = 2;
  const EVENT_UPDATE = 3;
  const events = useRef([]);

  const channelView = useRef({
    cardId: null,
    channelId: null,
    batch: 1,
    revision: null,
    begin: null,
    init: false,
    error: false,
  });

  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const profile = useContext(ProfileContext);
  const topics = useRef(new Map());
  const view = useRef(0);
  const serialize = useRef(0);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }  

  const getSubject = (conversation) => {
    if (!conversation) {
      return null;
    }

    try {
      let subject = JSON.parse(conversation.data.channelDetail.data).subject;
      if (subject) {
        return subject;
      }
    }
    catch (err) {
      return null;
    }
  }

  const getContacts = (conversation) => {
    if (!conversation) {
      return null;
    }

    let members = [];
    if (conversation.guid) {
      members.push(card.actions.getCardByGuid(conversation.guid)?.data?.cardProfile?.handle);
    }
    for (let member of conversation.data.channelDetail.members) {
      let contact = card.actions.getCardByGuid(member)
      if(contact?.data?.cardProfile?.handle) {
        members.push(contact?.data?.cardProfile?.handle);
      }
    }
    return members.join(', ');
  }

  const getMembers = (conversation) => {
    if (!conversation) {
      return null;
    }
    let members = new Set();
    if (conversation.guid) {
      members.add(conversation.guid);
    }
    for (let member of conversation.data.channelDetail.members) {
      if (profile.state.profile.guid != member) {
        members.add(member);
      }
    }
    return members;
  }

  const getChannel = () => {
    const { cardId, channelId } = channelView.current;
    if (cardId) {
      return card.actions.getChannel(cardId, channelId);
    }
    return channel.actions.getChannel(channelId);
  }

  const getTopicDelta = async (revision, count, begin, end) => {

    const { cardId, channelId } = channelView.current;
    if (cardId) {
      return await card.actions.getChannelTopics(cardId, channelId, revision, count, begin, end);
    }
    return await channel.actions.getChannelTopics(channelId, revision, count, begin, end);
  }

  const getTopic = async (topicId) => {
    const { cardId, channelId } = channelView.current;
    if (cardId) {
      return await card.actions.getChannelTopic(cardId, channelId, topicId);
    }
    return await channel.actions.getChannelTopic(channelId, topicId);
  } 

  const getChannelRevision = async () => {
    const { cardId, channelId } = channelView.current;
    if (cardId) {
      return await card.actions.getChannelRevision(cardId, channelId);
    }
    return await channel.actions.getChannelRevision(channelId);
  }

  const setTopicDelta = async (delta, curView) => {
    for (let topic of delta) {
      if (topic.data == null) {
        if (curView == view.current) {
          topics.current.delete(topic.id);
        }
      }
      else {
        let cur = topics.current.get(topic.id);
        if (cur == null) {
          cur = { id: topic.id, data: {} };
        }
        if (topic.data.detailRevision != cur.data.detailRevision) {
          if(topic.data.topicDetail) {
            cur.data.topicDetail = topic.data.topicDetail;
            cur.data.detailRevision = topic.data.detailRevision;
          }
          else {
            let slot = await getTopic(topic.id);
            cur.data.topicDetail = slot.data.topicDetail;
            cur.data.detailRevision = slot.data.detailRevision;
          }
        }
        cur.revision = topic.revision;
        if (curView == view.current) {    
          topics.current.set(topic.id, cur);
        }
      }
    }
  }

  const setTopics = async (ev) => {
    const curView = view.current;
    try {
      if (ev.type == EVENT_OPEN) {
        const { cardId, channelId } = ev.data;
        channelView.current.cardId = cardId;
        channelView.current.channelId = channelId;
        channelView.current.batch = 1;
        channelView.current.error = false;
        channelView.current.init = true;
        let delta = await getTopicDelta(null, TOPIC_BATCH, null, null);
        await setTopicDelta(delta.topics, curView);
        channelView.current.revision = delta.revision;
        channelView.current.begin = delta.marker;
      }
      else if (ev.type == EVENT_MORE) {
        if (channelView.current.init) {
          channelView.current.batch += 1;
          let delta = await getTopicDelta(null, channelView.current.batch * TOPIC_BATCH, null, channelView.current.begin);
          await setTopicDelta(delta.topics, curView);
          channelView.current.begin = delta.marker;
        }
      }
      else if (ev.type == EVENT_UPDATE) {
        let deltaRevision = getChannelRevision();
        if (channelView.current.init && deltaRevision != channelView.current.revision) {
          let delta = await getTopicDelta(channelView.current.revision, null, channelView.current.begin, null);
          await setTopicDelta(delta.topics, curView);
          channelView.current.revision = delta.revision;
        }
      }

      if (curView == view.current) {
        let chan = getChannel();
        let subject = getSubject(chan);
        let contacts = getContacts(chan);
        let members = getMembers(chan);
        updateState({
          init: true,
          subject,
          contacts,
          members,
          topics: topics.current,
          revision: channelView.current.revision,
        });
      }
    }
    catch (err) {
      if (!channelView.current.error) {
        window.alert("This converstaion failed to update");
        channelView.current.error = true;
      }
    }
  }

  const updateConversation = async () => {
    if (!card.state.init || !channel.state.init) {
      return;
    }

    if (serialize.current == 0) {
      serialize.current++;

      while (events.current.length > 0) {

        // collapse updates
        while (events.current.length > 1) {
          if(events.current[0].type == EVENT_UPDATE && events.current[1].type == EVENT_UPDATE) {
            events.current.shift();
          }
          else {
            break;
          }
        }

        const ev = events.current.shift();
        await setTopics(ev);
      }
      updateState({ loading: false });
      serialize.current--;
    }
  };

  useEffect(() => {
    events.current.push({ type: EVENT_UPDATE });
    updateConversation();
  }, [card, channel]);

  const actions = {
    setConversationId: (cardId, channelId) => {

      view.current += 1;
      updateState({ init: false, loading: true });
      events.current = [{ type: EVENT_OPEN, data: { cardId, channelId }}];
      updateState({ subject: null, cardId, channelId, topics: new Map() });
      topics.current = new Map();
      updateConversation();

    },
    addHistory: () => {
      updateState({ loading: true });
      events.current.push({ type: EVENT_MORE });
      updateConversation();
    },
    setChannelSubject: async (subject) => {
      return await channel.actions.setChannelSubject(channelView.current.channelId, subject);
    },
    setChannelCard: async (cardId) => {
      return await channel.actions.setChannelCard(channelView.current.channelId, cardId);
    },
    clearChannelCard: async (cardId) => {
      return await channel.actions.clearChannelCard(channelView.current.channelId, cardId);
    },
    getAssetUrl: (topicId, assetId) => {
      const { cardId, channelId } = channelView.current;
      if (channelView.current.cardId) {
        return card.actions.getContactChannelTopicAssetUrl(cardId, channelId, topicId, assetId);
      }
      else {
        return channel.actions.getChannelTopicAssetUrl(channelId, topicId, assetId);
      }
    },
    removeConversation: async () => {
      const { cardId, channelId } = channelView.current;
      if (cardId) {
        return await card.actions.removeChannel(cardId, channelId);
      }
      else {
        return await channel.actions.removeChannel(channelId);
      }
    },
    removeTopic: async (topicId) => {
      const { cardId, channelId } = channelView.current;
      if (cardId) {
        return await card.actions.removeChannelTopic(cardId, channelId, topicId);
      }
      else {
        return await channel.actions.removeChannelTopic(channelId, topicId);
      }
    },
    setTopicSubject: async (topicId, data) => {
      const { cardId, channelId } = channelView.current;
      if (cardId) {
        return await card.actions.setChannelTopicSubject(cardId, channelId, topicId, data);
      }
      else {
        return await channel.actions.setChannelTopicSubject(channelId, topicId, data);
      }
    }
  }

  return { state, actions }
}


