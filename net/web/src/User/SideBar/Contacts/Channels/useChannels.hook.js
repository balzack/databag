import { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContext } from 'context/CardContext';
import { ProfileContext } from 'context/ProfileContext';
import { ChannelContext } from 'context/ChannelContext';
import { StoreContext } from 'context/StoreContext';

export function useChannels() {

  const [state, setState] = useState({
    channels: [],
    startCards: [],
    startSubject: '',
    startDescription: '',
    node: null,
    busy: false,
  });

  let cardChannels = useRef([]);
  let channels = useRef([]);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const navigate = useNavigate();
  const card = useContext(CardContext);
  const profile = useContext(ProfileContext);
  const channel = useContext(ChannelContext);
  const store = useContext(StoreContext);

  const actions = {
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
          let added = await channel.actions.addChannel(state.startCards, state.startSubject, state.startDescription);
          done = true;
          navigate(`/user/conversation/${added.id}`);
        }
        catch (err) {
          window.alert(err);
        }
        updateState({ busy: false });
      }
      return done;
    }
  };

  const setUpdated = (chan) => {
    let key = `${chan.id}::${chan.cardId}`
    if (store.state[key] && store.state[key] == chan.revision) {
      chan.updated = false;
    }
    else {
      chan.updated = true;
    }
  }

  useEffect(() => {
    let merged = [ ...channels.current, ...cardChannels.current ];
    merged.forEach(c => { setUpdated(c) });
  }, [store]); 

  useEffect(() => {
    cardChannels.current = [];
    card.state.cards.forEach((value, key, map) => {
      cardChannels.current.push(...Array.from(value.channels.values()));
    });
    cardChannels.current.forEach(c => { setUpdated(c) });
    let merged = [ ...channels.current, ...cardChannels.current ];
    merged.sort((a, b) => {
      if (a?.data?.channelSummary?.lastTopic?.created > b?.data?.channelSummary?.lastTopic?.created) {
        return -1;
      }
      return 1;
    });
    updateState({ channels: merged });
  }, [card])

  useEffect(() => {
    channels.current = Array.from(channel.state.channels.values());
    channels.current.forEach(c => { setUpdated(c) });
    let merged = [ ...channels.current, ...cardChannels.current ];
    merged.sort((a, b) => {
      if (a?.data?.channelSummary?.lastTopic?.created > b?.data?.channelSummary?.lastTopic?.created) {
        return -1;
      }
      return 1;
    });
    updateState({ channels: merged });
  }, [channel])

  useEffect(() => {
    updateState({ node: profile.state.profile.node });
  }, [profile])

  return { state, actions };
}

