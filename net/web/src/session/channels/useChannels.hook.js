import { useContext, useState, useEffect, useRef } from 'react';
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

  // TODO optimize (avoid rebuild object when not needed)
  const getChannel = (cardId, channelId, value) => {
    const chan = {};
    chan.cardId = cardId;
    chan.channelId = channelId;
    chan.revision = value.revision;
    chan.updated = value.data?.channelSummary?.lastTopic?.created;

    // set updated flag
    const key = `${cardId}:${channelId}`
    const login = store.state['login:timestamp'];
    if (!chan.updated || !login || chan.updated < login) {
      chan.updatedFlag = false;
    }
    else if (store.state[key] && store.state[key] === value.revision) {
      chan.updatedFlag = false;
    }
    else {
      chan.updatedFlag = true;
    }

    // extract member info
    let memberCount = 0;
    let names = [];
    let img = null;
    let logo = null;
    if (cardId) {
      const contact = card.state.cards.get(cardId);
      const profile = contact?.data?.cardProfile;
      if (profile?.name) {
        names.push(profile.name);
      }
      if (profile?.imageSet) {
        img = null;
        logo = card.actions.getCardImageUrl(contact.id);
      }
      else {
        img = 'avatar';
        logo = null;
      }
      memberCount++;
    }
    for (let guid of value?.data?.channelDetail?.members) {
      if (guid !== profile.state.identity.guid) {
        const contact = getCardByGuid(card.state.cards, guid);
        const profile = contact?.data?.cardProfile;
        if (profile?.name) {
          names.push(profile.name);
        }
        if (profile?.imageSet) {
          img = null;
          logo = card.actions.getCardImageUrl(contact.id);
        }
        else {
          img = 'avatar';
          logo = null;
        }
        memberCount++;
      }
    }

    // set logo and label
    if (memberCount === 0) {
      chan.img = 'solution';
      chan.label = 'Notes';
    }
    else if (memberCount === 1) {
      chan.logo = logo;
      chan.img = img;
      chan.label = names.join(',');
    }
    else {
      chan.img = 'appstore';
      chan.label = names.join(',');
    }
    
    // set subject
    const detail = value.data?.channelDetail;
    if (detail?.dataType === 'sealedchannel') {
      // handle sealed subject
      chan.locked = true;
      chan.unlocked = false;
    }
    else if (detail?.dataType === 'superbasic') {
      chan.locked = false;
      chan.unlocked = true;
      try {
        const data = JSON.parse(detail.data);
        chan.subject = data.subject;
      }
      catch(err) {
        console.log(err);
      }
    }
    if (chan.subject == null) {
      chan.subject = chan.label;
    }

    // set message
    const topic = value.data?.channelSummary?.lastTopic;
    if (topic?.dataType === 'sealedtopic') {
      // handle sealed topic
    }
    else if (topic?.dataType === 'superbasictopic') {
      try {
        const data = JSON.parse(topic.data);
        chan.message = data.text;
      }
      catch(err) {
        console.log(err);
      }
    }

    return chan;
  }

  useEffect(() => {
    const merged = [];
    card.state.cards.forEach((cardValue, cardKey) => {
      cardValue.channels.forEach((channelValue, channelKey) => {
        const chan = getChannel(cardKey, channelKey, channelValue);
        merged.push(chan);
      });
    });
    channel.state.channels.forEach((channelValue, channelKey) => {
      merged.push(getChannel(null, channelKey, channelValue));
    });

    merged.sort((a, b) => {
      const aUpdated = a.updated;
      const bUpdated = b.updated;
      if (aUpdated === bUpdated) {
        return 0;
      }
      if (!aUpdated || aUpdated < bUpdated) {
        return 1;
      }
      return -1;
    });

    const filtered = merged.filter((chan) => {
      const subject = chan?.subject?.toUpperCase();
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
