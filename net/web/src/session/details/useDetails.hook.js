import { useContext, useState, useEffect, useRef } from 'react';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';

export function useDetails(cardId, channelId) {

  const [state, setState] = useState({
    logo: null,
    img: null,
    subject: null,
    server: null,
    startedDate: null,
    startedTime: null,
    host: null,
    contacts: [],
  });

  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  
  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    let img, subject, host, started;
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

    if (chan) {
      if (chan.contacts?.length == 0) {
        img = 'solution';
        subject = 'Private';
      }
      else if (chan.contacts?.length > 1) {
        img = 'appstore'
        subject = 'Group';
      }
      else {
        img = 'team';
        subject = 'Direct'
      }
      const parsed = JSON.parse(chan.data.channelDetail.data);
      if (parsed.subject) {
        subject = parsed.subject;
      }
      const date = new Date(chan.data.channelDetail.created * 1000);
      const now = new Date();
      if(now.getTime() - date.getTime() < 86400000) {
        started = date.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
      }
      else {
        started = date.toLocaleDateString("en-US");
      }
      if (chan.cardId) {
        host = false;
      }
      else {
        host = true;
      }
    }
    updateState({ img, subject, host, started,
      contacts: chan.contacts.map((contact) => contact?.id) });
  }, [cardId, channelId, card, channel]);

  const actions = {
  };

  return { state, actions };
}

