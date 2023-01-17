import { useContext, useState, useEffect, useRef } from 'react';
import { StoreContext } from 'context/StoreContext';
import { ChannelContext } from 'context/ChannelContext';
import { CardContext } from 'context/CardContext';
import { AccountContext } from 'context/AccountContext';
import { ProfileContext } from 'context/ProfileContext';
import { getCardByGuid } from 'context/cardUtil';

export function useChannelItem(cardId, channelId, filter, active) {

  const [state, setState] = useState({
    set: false,
    visible: false,
    active: false,
    locked: false,
    unlocked: false,
    updateFlag: false,
    img: null,
    logo: null,
    subject: null,
    message: null,
  });

  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const account = useContext(AccountContext);
  const store = useContext(StoreContext);
  const profile = useContext(ProfileContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const syncing = useRef(false);
  const setCardId = useRef();
  const setChannelId = useRef();
  const setCardRevision = useRef();
  const setChannelRevision = useRef();
  const setSealKey = useRef();

  const actions = {
  };

  useEffect(() => {
    sync();
    // eslint-disable-next-line
  }, [card.state, channel.state, store.state, account.state]);

  useEffect(() => {
    if (cardId === active?.card && channelId === active?.channel) {
      updateState({ active: true });
    }
    else {
      updateState({ active: false });
    }
  }, [cardId, channelId, active]);

  useEffect(() => {
    if (filter) {
      if (state.subject) {
        updateState({ visible: state.subject.toUpperCase().includes(filter) });
      }
      else {
        updateState({ visible: false });
      }
    }
    else {
      updateState({ visible: true });
    }
  }, [filter, state.subject]);

  const sync = async () => {
    if (!syncing.current) {
      syncing.current = true;

      if (cardId !== setCardId.current || channelId !== setChannelId.current) {
        await setChannel(cardId, channelId);
        syncing.current = false;
        await sync();
        return;
      }
      if (cardId) {
        const contact = card.state.cards.get(cardId);
        if (contact?.revision !== setCardRevision.current) {
          await setChannel(cardId, channelId);
          syncing.current = false;
          await sync();
          return;
        }
        const conversation = contact.channels.get(channelId);
        if (conversation?.revision !== setChannelRevision.current) {
          await setChannel(cardId, channelId);
          syncing.current = false;
          await sync();
          return;
        }
      }
      else {
        const conversation = channel.state.channels.get(channelId);
        if (conversation?.revision !== setChannelRevision.current) {
          await setChannel(cardId, channelId);
          syncing.current = false;
          await sync();
          return;
        }
      }
      const key = account.state.sealKey;
      if (key?.pulic !== setSealKey.current?.public || key?.private !==  setSealKey.current?.private) {
        await setChannel(cardId, channelId);
        syncing.current = false;
        await sync();
        return;
      }

      syncing.current = false;
    }
  }

  const setChannel = (cardId, channelId) => {
    if (cardId) {
      const cardItem = card.state.cards.get(cardId);
      const channelItem = cardItem?.channels?.get(channelId);
      setChannelItem(cardItem, channelItem);
      setCardRevision.current = cardItem?.revision;
      setChannelRevision.current = channelItem?.revision;
    }
    else {
      const channelItem = channel.state.channels.get(channelId);
      setChannelItem(null, channelItem);
      setChannelRevision.current = channelItem?.revision;
    }
    setSealKey.current = account.state.sealKey;
    setChannelId.current = channelId;
    setCardId.current = cardId;
  };

  const setChannelItem = (cardItem, channelItem) => {

    if (!channelItem) {
      updateState({ set: false });
      return;
    }
    const chan = { set: true };
      
    // set updated flag
    const key = `${cardId}:${channelId}`
    const login = store.state['login:timestamp'];
    if (!chan.updated || !login || chan.updated < login) {
      chan.updatedFlag = false;
    }
    else if (store.state[key] && store.state[key] === channelItem.revision) {
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
    if (cardItem) {
      const profile = cardItem?.data?.cardProfile;
      if (profile?.name) {
        names.push(profile.name);
      }
      if (profile?.imageSet) {
        img = null;
        logo = card.actions.getCardImageUrl(cardId);
      }
      else {
        img = 'avatar';
        logo = null;
      }
      memberCount++;
    }
    for (let guid of channelItem?.data?.channelDetail?.members) {
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
    const detail = channelItem.data?.channelDetail;
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
    const topic = channel.data?.channelSummary?.lastTopic;
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

    updateState({ ...chan });
  }

  return { state, actions };
}
