import { useContext, useState, useEffect } from 'react';
import { StoreContext } from 'context/StoreContext';
import { ChannelContext } from 'context/ChannelContext';
import { CardContext } from 'context/CardContext';
import { ProfileContext } from 'context/ProfileContext';

export function useChannels() {

  const [filter, setFilter] = useState(null);

  const [state, setState] = useState({
    channels: [],
    busy: false }
  );

  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const store = useContext(StoreContext);
  const profile = useContext(ProfileContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    onFilter: (value) => {
      setFilter(value.toUpperCase());
    },
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

  const setContacts = (chan) => {
    let contacts = [];
    if (chan.guid != null && profile.state.profile.guid != chan.guid) {
      contacts.push(card.actions.getCardByGuid(chan.guid));
    }
    for (let guid of chan.data.channelDetail?.members) {
      if (guid != profile.state.profile.guid) {
        contacts.push(card.actions.getCardByGuid(guid));
      }
    }
    chan.contacts = contacts;
    if (contacts.length === 1 && contacts[0]) {
      chan.logo = card.actions.getImageUrl(contacts[0].id);
    }
  }

  const setSubject = (chan) => {
    let subject = "";
    if (chan.data.channelDetail?.data) {
      try {
        subject = JSON.parse(chan.data.channelDetail?.data).subject;
      }
      catch (err) {
        console.log(err);
      }
    }
    if (!subject) {
      let names = [];
      for (let contact of chan.contacts) {
        names.push(contact?.data?.cardProfile?.name);
      }
      subject = names.join(", ");
    }
    if (!subject && !chan.contacts?.length) {
      subject = "notes";
    }
    
    chan.subject = subject;  
  }

  const setMessage = (chan) => {
    let message = "";
    if (chan.data.channelSummary?.lastTopic?.dataType === 'superbasictopic') {
      try {
        message = JSON.parse(chan.data.channelSummary.lastTopic.data).text;
      }
      catch (err) {
        console.log(err);
      }
    }

    chan.message = message;
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

    merged.forEach(chan => { 
      setUpdated(chan);
      setContacts(chan);
      setSubject(chan);
      setMessage(chan);
    }); 

    const filtered = merged.filter((chan) => {
      let subject = chan?.subject?.toUpperCase();
      return !filter || subject?.includes(filter);    
    });

    updateState({ channels: filtered });

  }, [channel, card, store, filter]);

  return { state, actions };
}
