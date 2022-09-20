import { useState, useEffect, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';
import config from 'constants/Config';

export function useChannels() {

  const [state, setState] = useState({
    topic: null,
    channels: []
  });

  const channel = useContext(ChannelContext);
  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
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

  const setChannelEntry = (item) => {
    let contacts = [];
    if (item?.detail?.members) {
      item.detail.members.forEach(guid => {
        contacts.push(getCard(guid));
      })
    }

    let logo = null;
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

    return {
      channelId: item.channelId,
      contacts: contacts,
      logo: logo,
    }
  }

  useEffect(() => {
    const channels = Array.from(channel.state.channels.values()).map(item => setChannelEntry(item));
    updateState({ channels });
  }, [channel, card]);

  const actions = {
    setTopic: (topic) => {
      updateState({ topic });
    },
  };

  return { state, actions };
}

