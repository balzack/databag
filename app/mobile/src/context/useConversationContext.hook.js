import { useState, useEffect, useRef, useContext } from 'react';
import { StoreContext } from 'context/StoreContext';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';
import { ProfileContext } from 'context/ProfileContext';

export function useConversationContext() {
  const [state, setState] = useState({
    subject: null,
    logo: null,
    contacts: [],
    topics: [],
  });
  const store = useContext(StoreContext);
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const profile = useContext(ProfileContext);
  const topics = useRef(new Map());
  const revision = useRef(0);
  const detailRevision = useRef(0);
  const syncRevision = useRef(0);
  const syncing = useRef(false);
  const conversationId = useRef(null);
  const setView = useRef(0);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const getTopicItems = async (cardId, channelId) => {
    if (cardId) {
      return await card.actions.getChannelTopicItems(cardId, channelId);
    }
    return await channel.actions.getTopicItems(channelId);
  }
  const getTopicDeltaItems = async (cardId, channelId, revision) => {
    if (cardId) {
      return await card.actions.getChannelTopicDeltaItems(cardId, channelId, revision);
    }
    return await channel.actions.getTopicDeltaItems(channelId, revision);
  }
  const setTopicItem = async (cardId, channelId, revision, topic) => {
    if (cardId) {
      return await card.actions.setChannelTopicItem(cardId, channelId, revision, topic);
    }
    return await channel.actions.setTopicItem(channelId, revision, topic);
  }
  const clearTopicItem = async (cardId, channelId, topicId) => {
    if (cardId) {
      return await card.actions.clearChannelTopicItem(cardId, channelId, topicId);
    }
    return await channel.actions.clearTopicItem(channelId, topicId);
  }
  const getTopic = async (cardId, channelId, topicId) => {
    if (cardId) {
      return await card.actions.getChannelTopic(cardId, channelId, topicId);
    }
    return await channel.actions.getTopic(channelId, topicId);
  }
  const getTopics = async (cardId, channelId, revision) => {
    if (cardId) {
      return await card.actions.getChannelTopics(cardId, channelId, revision);
    }
    return await channel.actions.getTopics(channelId, revision)
  }
  const getTopicAssetUrl = (cardId, channelId, assetId) => {
    if (cardId) {
      return card.actions.getChannelTopicAssetUrl(cardId, channelId, topicId, assetId);
    }
    return channel.actions.getTopicAssetUrl(channelId, assetId);
  }
  const addTopic = async (cardId, channelId, message, asssets) => {
    if (cardId) {
      return await card.actions.addChannelTopic(cardId, channelId, message, assetId);
    }
    return await channel.actions.addTopic(channelId, message, assetId);
  }
  const setTopicSubject = async (cardId, channelId, topicId, data) => {
    if (cardId) {
      return await card.actions.setChannelTopicSubject(cardId, channelId, topicId, data);
    }
    return await channel.actions.setTopicSubject(channelId, topicId, data);
  }
  const remove = async (cardId, channelId) => {
    if (cardId) {
      return await card.actions.removeChannel(cardId, channelId);
    }
    return await channel.actions.remove(channelId);
  }
  const removeTopic = async (cardId, channelId, topicId) => {
    if (cardId) {
      return await card.actions.removeChannelTopic(cardId, channelId, topicId);
    }
    return await channel.actions.remvoeTopic(channelId, topicId);
  }

  const sync = async () => {
    const curView = setView.current;
    if (!syncing.current && conversationId.current) {
      const { cardId, channelId } = conversationId.current;
      const item = getChannel(cardId, channelId);
      if (item && (item.revision !== revision.current || item.syncRevision != syncRevision.current)) {
        syncing.current = true;

        // set channel details
        if (detailRevision.current != item.detailRevision) {
          if (curView === setView.current) {
            setChannel(item);
            detailRevision.current = item.detailRevision;
          }
        }

        // set channel topics
        if (syncRevision.current != item.syncRevision) {
          if (syncRevision.current) {
            const topics = await getTopicDeltaItems(cardId, channelId);
          }
          else {
            const topics = await getTopicItems(cardId, channelId);
          }
          if (curView === setView.current) {
            syncRevision.current = item.syncRevision;
          }
        }

        // sync from server to store
        if (item.topicRevision !== item.syncRevision) {
          const res = await getTopics(cardId, channelId, item.syncRevision)
res.topics.forEach(topic => {
  console.log(topic.data);
});
        }

        // update revision
        if (curView === setView.current) {
          revision.current = item.revision;
        }

        syncing.current = false;
        sync();
      }
    }
  }

  const getCard = (guid) => {
    let contact = null
    card.state.cards.forEach((card, cardId, map) => {
      if (card?.profile?.guid === guid) {
        contact = card;
      }
    });
    return contact;
  }

  const getChannel = (cardId, channelId) => {
    if (cardId) {
      const entry = card.state.cards.get(cardId);
      return entry?.channels.get(channelId);
    }
    return channel.state.channels.get(channelId);
  }

  const setChannel = (item) => {
    let contacts = [];
    let logo = null;
    let subject = null;

    if (!item) {
      updateState({ contacts, logo, subject });
      return;
    }

    if (item.cardId) {
      contacts.push(card.state.cards.get(item.cardId));
    }
    if (item?.detail?.members) {
      const profileGuid = profile.state.profile.guid;
      item.detail.members.forEach(guid => {
        if (profileGuid !== guid) {
          const contact = getCard(guid);
          contacts.push(contact);
        }
      })
    }

    if (contacts.length === 0) {
      logo = 'solution';
    }
    else if (contacts.length === 1) {
      if (contacts[0]?.profile?.imageSet) {
        logo = card.actions.getCardLogo(contacts[0].cardId, contacts[0].profileRevision);
      }
      else {
        logo = 'avatar';
      }
    }
    else {
      logo = 'appstore';
    }

    if (item?.detail?.data) {
      try {
        subject = JSON.parse(item?.detail?.data).subject;
      }
      catch (err) {
        console.log(err);
      }
    }
    if (!subject) {
      if (contacts.length) {
        let names = [];
        for (let contact of contacts) {
          if (contact?.profile?.name) {
            names.push(contact.profile.name);
          }
          else if (contact?.profile?.handle) {
            names.push(contact?.profile?.handle);
          }
        }
        subject = names.join(', ');
      }
      else {
        subject = "Notes";
      }
    }

    updateState({ subject, logo, contacts });
  }

  useEffect(() => {
    sync();
  }, [card, channel]);

  const actions = {
    setChannel: (channel) => {
      if (channel == null) {
        setView.current++;
        conversationId.current = null;
        updateState({ subject: null, logo: null, contacts: [], topics: [] });
      }
      else if (channel.cardId !== conversationId.current?.cardId || channel.channelId !== conversationId.current?.channelId) {
        setView.current++;
        conversationId.current = channel;
        updateState({ subject: null, logo: null, contacts: [], topics: [] });

        revision.current = null;
        detailRevision.current = null;
        syncRevision.current = null;
        topics.current = new Map();
        sync();
      }
    },
  }

  return { state, actions }
}


