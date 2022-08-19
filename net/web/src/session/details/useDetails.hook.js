import { useContext, useState, useEffect, useRef } from 'react';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';

export function useDetails(cardId, channelId) {

  const [state, setState] = useState({
    logo: null,
    img: null,
  });

  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  
  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    let logo, img;
    let chan;
    if (cardId) {
      const cardChan = card.state.cards.get(cardId);
      if (cardChan) {
        chan = cardChan.channels.get(channelId);
      }
    }
    else {
      chan = channel.state.channels.get(channelId);
    }
    console.log(chan);

    if (chan) {
      if (chan.contacts?.length == 0) {
        img = 'solution';
        logo = null;
      }
      else if (chan.contacts?.length > 1) {
        img = 'appstore'
        logo = null;
      }
      else {
        img = null;
        logo = card.actions.getImageUrl(chan.contacts[0]?.id);
      }
    }
    updateState({ logo, img });
  }, [cardId, channelId, card, channel]);

  const actions = {
  };

  return { state, actions };
}

