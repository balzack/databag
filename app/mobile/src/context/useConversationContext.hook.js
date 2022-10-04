import { useState, useEffect, useRef, useContext } from 'react';
import { StoreContext } from 'context/StoreContext';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';
import { ProfileContext } from 'context/ProfileContext';

export function useConversationContext() {
  const [state, setState] = useState({
    subject: null,
    logo: null,
    revision: null,
    contacts: [],
    topics: new Map(),
  });
  const store = useContext(StoreContext);
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const profile = useContext(ProfileContext);
  const topics = useRef(null);
  const revision = useRef(0);
  const detailRevision = useRef(0);
  const syncing = useRef(false);
  const conversationId = useRef(null);
  const reset = useRef(false);
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
  const setTopicItem = async (cardId, channelId, topic) => {
    if (cardId) {
      return await card.actions.setChannelTopicItem(cardId, channelId, topic);
    }
    return await channel.actions.setTopicItem(channelId, topic);
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
  const setSyncRevision = async (cardId, channelId, revision) => {
    if (cardId) {
      return await card.actions.setSyncRevision(cardId, channelId, revision);
    }
    return await channel.actions.setSyncRevision(channelId, revision);
  }

  const sync = async () => {
    const curView = setView.current;
    if (!syncing.current) {
      if (reset.current) {
        revision.current = null;
        detailRevision.current = null;
        topics.current = null;
        reset.current = false;
      }
      if (conversationId.current) {
        const { cardId, channelId } = conversationId.current;
        const channelItem = getChannel(cardId, channelId);
        if (channelItem && (channelItem.revision !== revision.current)) {
          syncing.current = true;

          try {
            // set channel details
            if (detailRevision.current != channelItem.detailRevision) {
              if (curView === setView.current) {
                setChannel(channelItem);
                detailRevision.current = channelItem.detailRevision;
              }
            }

            // initial load from store
            if (!topics.current) {
              topics.current = new Map();
              const items = await getTopicItems(cardId, channelId);
              items.forEach(item => {
                topics.current.set(item.topicId, item);
              });
            }

            // sync from server
            if (channelItem.topicRevision !== channelItem.syncRevision) {
              const res = await getTopics(cardId, channelId, channelItem.syncRevision)
              for (const topic of res.topics) {
                if (!topic.data) {
                  topics.current.delete(topic.id);
                  await clearTopicItem(cardId, channelId, topic.id);
                }
                const cached = topics.current.get(topic.id);
                if (!cached || cached.detailRevision != topic.data.detailRevision) {
                  if (!topic.data.topicDetail) {
                    const updated = await getTopic(cardId, channelId, topic.id);
                    topic.data.topicDetail = updated.data.topicDetail;
                  }
                  await setTopicItem(cardId, channelId, topic);
                  const { id, revision, data } = topic;
                  topics.current.set(id, { topicId: id, revision: revision, detailRevision: topic.data.detailRevision, detail: topic.data.topicDetail });
                }
              }
              await setSyncRevision(cardId, channelId, channelItem.topicRevision);
            }

            // update revision
            revision.current = channelItem.revision;
            if (curView == setView.current) {
              if (cardId) {
                card.actions.setChannelReadRevision(cardId, channelId, revision.current);
              }
              else {
                channel.actions.setReadRevision(channelId, revision.current);
              }
              updateState({ topics: topics.current });
            }

            syncing.current = false;
            sync();
          }
          catch(err) {
            console.log(err);
            syncing.current = false;
            //TODO set to unsynced state
          }
        }
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
    setChannel: (selected) => {
      if (selected == null) {
        setView.current++;
        conversationId.current = null;
        reset.current = true;
        updateState({ subject: null, logo: null, contacts: [], topics: new Map() });
      }
      else if (selected.cardId !== conversationId.current?.cardId || selected.channelId !== conversationId.current?.channelId) {
        setView.current++;
        conversationId.current = selected;
        reset.current = true;
        updateState({ subject: null, logo: null, contacts: [], topics: new Map() });
        sync();
        const { cardId, channelId, revision } = selected;
        if (cardId) {
          card.actions.setChannelReadRevision(cardId, channelId, revision);
        }
        else {
          channel.actions.setReadRevision(channelId, revision);
        }
      }
    },
  }

  return { state, actions }
}


