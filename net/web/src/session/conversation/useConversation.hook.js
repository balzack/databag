import { useContext, useState, useEffect } from 'react';
import { ViewportContext } from 'context/ViewportContext';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';

export function useConversation(cardId, channelId) {

  const [state, setState] = useState({
    display: null,
    image: null,
    logo: null,
    subject: null,
  });

  const viewport = useContext(ViewportContext);  
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  useEffect(() => {

    let chan, image, subject, logo; 
    if (cardId) {
      const cardChan = card.state.cards.get(cardId);
      if (cardChan) {
        chan = cardChan.channels.get(channelId);
      }
    }
    else {
      chan = channel.state.channels.get(channelId);
    }

    if (chan) {
      if (!chan.contacts?.length) {
        image = 'solution';
        subject = 'Private';
      }
      else if (chan.contacts.length > 1) {
        image = 'appstore'
        subject = 'Group';
      }
      else {
        logo = card.actions.getImageUrl(chan.contacts[0]?.id);
        subject = card.actions.getName(chan.contacts[0]?.id);
      }
      const parsed = JSON.parse(chan.data.channelDetail.data);
      if (parsed.subject) {
        subject = parsed.subject;
      }
    }

    updateState({ image, subject, logo });
  }, [cardId, channelId, card, channel]);


  const actions = {
  };

  return { state, actions };
}

