import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';
import { AccountContext } from 'context/AccountContext';
import { ViewportContext } from 'context/ViewportContext';

export function useDetails(cardId, channelId) {

  const [state, setState] = useState({
    logo: null,
    img: null,
    subject: null,
    server: null,
    started: null,
    host: null,
    contacts: [],
    members: new Set(),
    editSubject: false,
    editMembers: false,
    busy: false,
    subjectUpdate: null,
    unknown: 0,
    display: null,
    locked: false,
    unlocked: false,
    editable: false,
  });

  const card = useContext(CardContext);
  const account = useContext(AccountContext);
  const channel = useContext(ChannelContext);
  const viewport = useContext(ViewportContext);  

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  useEffect(() => {
    let img, subject, subjectUpdate, host, started, contacts, locked, unlocked, editable;
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
      if (chan.contacts?.length === 0) {
        img = 'solution';
        subject = 'Notes';
      }
      else if (chan.contacts?.length > 1) {
        img = 'appstore'
        subject = 'Group';
      }
      else {
        img = 'team';
        subject = 'Conversation'
      }
      if (chan.data.channelDetail.dataType === 'sealed') {
        editable = false;
        try {
          const seals = JSON.parse(chan.data.channelDetail.data).seals;
          seals.forEach(seal => {
            if (account.state.sealKey?.public === seal.publicKey) {
              editable = true;
            }
          });
        }
        catch (err) {
          console.log(err);
        }
        locked = true;
        unlocked = chan.data.unsealedChannel != null;
        if (chan.data.unsealedChannel?.subject) {
          subject = chan.data.unsealedChannel.subject;
          subjectUpdate = subject;
        }
      }
      else {
        locked = false;
        editable = (chan.cardId == null);
        const parsed = JSON.parse(chan.data.channelDetail.data);
        if (parsed.subject) {
          subject = parsed.subject;
          subjectUpdate = subject;
        }
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

    if (chan?.contacts ) {
      contacts = chan.contacts.map((contact) => contact?.id);
    }
    else {
      contacts = [];
    }
    
    let members = new Set(contacts);
    let unknown = 0;
    contacts.forEach(id => {
      if (id == null) {
        unknown++;
      }
    });

    updateState({ img, subject, host, started, contacts, members, unknown, subjectUpdate, locked, unlocked, editable });
  }, [cardId, channelId, card, channel, account]);

  const actions = {
    setEditSubject: () => {
      updateState({ editSubject: true });
    },
    clearEditSubject: () => {
      updateState({ editSubject: false });
    },
    setSubjectUpdate: (subjectUpdate) => {
      updateState({ subjectUpdate });
    },
    setSubject: async () => {
      if (!state.busy) {
        try {
          updateState({ busy: true });
          if (state.locked) {
            channel.actions.setChannelSealedSubject(channelId, state.subjectUpdate, account.state.sealKey);
          }
          else {
            channel.actions.setChannelSubject(channelId, state.subjectUpdate);
          }
          updateState({ busy: false });
        }
        catch(err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error("set channel subject failed");
        }
      }
      else {
        throw new Error('operation in progress');
      }
    },
    setEditMembers: () => {
      updateState({ editMembers: true });
    },
    clearEditMembers: () => {
      updateState({ editMembers: false });
    },
    onMember: async (card) => {
      if (state.members.has(card)) {
        channel.actions.clearChannelCard(channelId, card);
      }
      else {
        channel.actions.setChannelCard(channelId, card);
      }
    },
    deleteChannel: async () => {
      await channel.actions.removeChannel(channelId);
    },
    leaveChannel: async () => {
      await card.actions.removeChannel(cardId, channelId);
    }
  };

  return { state, actions };
}

