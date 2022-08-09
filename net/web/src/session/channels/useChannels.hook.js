import { useContext, useState, useEffect } from 'react';
import { StoreContext } from 'context/StoreContext';
import { ChannelContext } from 'context/ChannelContext';
import { CardContext } from 'context/CardContext';

export function useChannels() {

  const [state, setState] = useState({
    channels: [],
    busy: false }
  );

  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const store = useContext(StoreContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
  };

  const setUpdated = (chan) => {
    const login = store.state['login:timestamp'];
    const update = chan?.data?.channelSummary?.lastTopic?.created;

    if (!update || (login && update < login)) {
      chan.updated = false;
      return;
    }

    let key = `${chan.id}::${chan.cardId}`
    if (store.state[key] && store.state[key] == chan.revision) {
      chan.updated = false;
    }
    else {
      chan.updated = true;
    }
  }

  useEffect(() => {
    let merged = [];
    card.state.cards.forEach((value, key, map) => {
      merged.push(...Array.from(value.channels.values()));
    });
    merged.push(...Array.from(channel.state.channels.values()));

    merged.sort((a, b) => {
      if (a?.data?.channelSummary?.lastTopic?.created > b?.data?.channelSummary?.lastTopic?.created) {
        return -1;
      }
      return 1;
    });

    merged.forEach(chan => { setUpdated(chan) });
    updateState({ channels: merged }); 
  }, [channel, card, store]);

  return { state, actions };
}
