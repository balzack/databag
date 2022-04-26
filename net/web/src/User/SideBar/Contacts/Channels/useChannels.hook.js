import { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';

export function useChannels() {

  const [state, setState] = useState({
    channels: [],
    startCards: [],
    startSubject: '',
    startDescription: '',
    busy: false,
  });

  let cardChannels = useRef([]);
  let channels = useRef([]);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const navigate = useNavigate();
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);

  const actions = {
    select: (channel) => {
      navigate(`/user/channel/${channel.id}`);
    },
    getCardImageUrl: card.actions.getImageUrl,
    getCards: () => {
      let cards = Array.from(card.state.cards.values())
      return cards.filter(c => c.data.cardDetail.status == 'connected');
    },
    setStartCards: (cards) => updateState({ startCards: cards }),
    setStartSubject: (value) => updateState({ startSubject: value }),
    setStartDescription: (value) => updateState({ startDescription: value }),
    addChannel: async () => {
      let done = false;
      if (!state.busy) {
        updateState({ busy: true });
        try {
          await channel.actions.addChannel(state.startCards, state.startSubject, state.startDescription);
          done = true;
        }
        catch (err) {
          window.alert(err);
        }
        updateState({ busy: false });
      }
      return done;
    }
  };

  useEffect(() => {
    cardChannels.current = [];
    card.state.cards.forEach((value, key, map) => {
      cardChannels.current.push(...Array.from(value.channels.values()));
    });
    updateState({ channels: [ ...channels.current, ...cardChannels.current ]});
  }, [card])

  useEffect(() => {
    channels.current = Array.from(channel.state.channels.values());
    updateState({ channels: [ ...channels.current, ...cardChannels.current ]});
  }, [channel])

  return { state, actions };
}

