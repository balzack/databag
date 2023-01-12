import { useContext, useState, useEffect } from 'react';
import { StoreContext } from 'context/StoreContext';
import { ChannelContext } from 'context/ChannelContext';
import { CardContext } from 'context/CardContext';
import { AccountContext } from 'context/AccountContext';
import { ProfileContext } from 'context/ProfileContext';
import { ViewportContext } from 'context/ViewportContext';
import { getCardByGuid } from 'context/cardUtil';

export function useChannels() {

  const [filter, setFilter] = useState(null);

  const [state, setState] = useState({
    display: null,
    channels: [],
    showAdd: false,
    busy: false,
    members: new Set(),
    subject: null,
    seal: false,
    sealable: false,
  });

  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const account = useContext(AccountContext);
  const store = useContext(StoreContext);
  const profile = useContext(ProfileContext);
  const viewport = useContext(ViewportContext);

  useEffect(() => {
    const { seal, sealKey } = account.state;
    if (seal?.publicKey && sealKey?.public && sealKey?.private && seal.publicKey === sealKey.public) {
      updateState({ sealable: true });
    }
    else {
      updateState({ seal: false, sealable: false });
    }
  }, [account]);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    addChannel: async () => {
      let added;
      if (!state.busy) {
        try {
          updateState({ busy: true });
          let cards = Array.from(state.members.values());
          if (state.seal) {
            let keys = [ account.state.sealKey.public ];
            cards.forEach(id => {
              keys.push(card.state.cards.get(id).data.cardProfile.seal);
            });
            added = await channel.actions.addSealedChannel(cards, state.subject, keys);
          }
          else {
            added = await channel.actions.addBasicChannel(cards, state.subject);
          }
          updateState({ busy: false });
        }
        catch(err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error("failed to create new channel");
        }
      }
      else {
        throw new Error("operation in progress");
      }
      return added.id;
    },
    setSeal: (seal) => {
      if (seal) {
        let cards = Array.from(state.members.values());
        let members = new Set(state.members);
        cards.forEach(id => {
          if (!(card.state.cards.get(id)?.data?.cardProfile?.seal)) {
            members.delete(id);
          }    
        });
        updateState({ seal: true, members });
      }
      else {
        updateState({ seal: false });
      }
    },
    onFilter: (value) => {
      setFilter(value.toUpperCase());
    },
    setShowAdd: () => {
      updateState({ showAdd: true, seal: false });
    },
    clearShowAdd: () => {
      updateState({ showAdd: false, members: new Set(), subject: null });
    },
    onMember: (string) => {
      let members = new Set(state.members);
      if (members.has(string)) {
        members.delete(string);
      }
      else {
        members.add(string);
      }
      updateState({ members });
    },
    setSubject: (subject) => {
      updateState({ subject });
    },
    cardFilter: (card) => {
      if (state.seal) {
        return card?.data?.cardDetail?.status === 'connected' && card?.data?.cardProfile?.seal;
      }
      return card?.data?.cardDetail?.status === 'connected';
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
    if (store.state[key] && store.state[key] === chan.revision) {
      chan.updated = false;
    }
    else {
      chan.updated = true;
    }
  }

  const setContacts = (chan) => {
    let contacts = [];
    if (chan.guid != null && profile.state.identity.guid !== chan.guid) {
      const contact = getCardByGuid(card.state.cards, chan.guid);
      contacts.push(contact);
    }
    for (let guid of chan.data.channelDetail?.members) {
      if (guid !== profile.state.identity.guid) {
        const contact = getCardByGuid(card.state.cards, guid);
        contacts.push(contact);
      }
    }
    chan.contacts = contacts;
    if (contacts.length === 1 && contacts[0]) {
      chan.logo = card.actions.getCardImageUrl(contacts[0].id);
    }
  }

  const setSubject = (chan) => {
    let subject = "";
    if (chan.data.channelDetail.dataType === 'sealed') {
      chan.locked = chan.data.channelDetail.dataType === 'sealed'
      if (state.sealable) {
        try {
          if (chan.data.unsealedChannel == null) {
            if (chan.cardId) {
              card.actions.unsealChannelSubject(chan.cardId, chan.id, account.state.sealKey);
            }
            else {
              channel.actions.unsealChannelSubject(chan.id, account.state.sealKey);
            }
          }
          else {
            if (chan.cardId) {
              chan.unlocked = card.actions.isUnsealed(chan.cardId, chan.id, account.state.sealKey);
            }
            else {
              chan.unlocked = channel.actions.isUnsealed(chan.id, account.state.sealKey);
            }
            subject = chan.data.unsealedChannel.subject;
          }
        }
        catch (err) {
          console.log(err)
        }
      }
    }
    else {
      if (chan.data.channelDetail?.data) {
        try {
          subject = JSON.parse(chan.data.channelDetail?.data).subject;
        }
        catch (err) {
          console.log(err);
        }
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
      subject = "Notes";
    }
    
    chan.subject = subject;  
  }

  const setMessage = (chan) => {
    let message = '';
    if (chan.data.channelSummary?.lastTopic?.dataType === 'superbasictopic') {
      try {
        message = JSON.parse(chan.data.channelSummary.lastTopic.data).text;
      }
      catch (err) {
        console.log(err);
      }
    }
    if (chan.data.channelSummary?.lastTopic?.dataType === 'sealedtopic') {
      try {
        if (chan.unlocked) {
          message = "...";
          if (chan.data.unsealedSummary == null) {
            if (chan.cardId) {
              card.actions.unsealChannelSummary(chan.cardId, chan.id, account.state.sealKey);
            }
            else {
              channel.actions.unsealChannelSummary(chan.id, account.state.sealKey);
            }
          }
          else {
            if (typeof chan.data.unsealedSummary.message.text === 'string') {
              message = chan.data.unsealedSummary.message.text;
            }
          }
        }
      }
      catch (err) {
        console.log(err)
      }
    }

    if (typeof message === 'string') {
      chan.message = message;
    }
  } 

  useEffect(() => {
    let merged = [];
    card.state.cards.forEach((value, key, map) => {
      merged.push(...Array.from(value.channels.values()));
    });
    merged.push(...Array.from(channel.state.channels.values()));

    merged.sort((a, b) => {
      const aCreated = a?.data?.channelSummary?.lastTopic?.created;
      const bCreated = b?.data?.channelSummary?.lastTopic?.created;
      if (aCreated === bCreated) {
        return 0;
      }
      if (!aCreated || aCreated < bCreated) {
        return 1;
      }
      return -1;
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

    // eslint-disable-next-line
  }, [account, channel, card, store, filter, state.sealable]);

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  return { state, actions };
}
