import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConversationContext } from 'context/ConversationContext';
import { CardContext } from 'context/CardContext';
import { AccountContext } from 'context/AccountContext';
import { ProfileContext } from 'context/ProfileContext';
import { getChannelSubjectLogo } from 'context/channelUtil';
import { getCardByGuid } from 'context/cardUtil';
import { getChannelSeals, isUnsealed, getContentKey, updateChannelSubject } from 'context/sealUtil';
import { getLanguageStrings } from 'constants/Strings';
import { DisplayContext } from 'context/DisplayContext';
import moment from 'moment';

export function useDetails(clear) {

  const [state, setState] = useState({
    strings: getLanguageStrings(),
    subject: null,
    timestamp: null,
    logo: null,
    hostId: null,
    connected: [],
    members: [],
    editSubject: false,
    editMembers: false,
    subjectUpdate: null,
    pushEnabled: false,
    locked: false,
    unlocked: false,
    seals: null,
    sealKey: null,
    deleteBusy: false,
    blockBusy: false,
    unknown: 0,
    notification: null,
  });

  const card = useContext(CardContext);
  const account = useContext(AccountContext);
  const conversation = useContext(ConversationContext);
  const profile = useContext(ProfileContext);
  const display = useContext(DisplayContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    (async () => {
      const notification = await conversation.actions.getNotifications();
      updateState({ notification });
    })();
  }, [conversation.state.card, conversation.state.channel]);

  useEffect(() => {
    let locked;
    let unlocked;
    let seals;
    let sealKey;
    const { channel } = conversation.state;
    if (channel?.detail?.dataType === 'sealed') {
      locked = true;
      try {
        sealKey = account.state.sealKey;
        seals = getChannelSeals(channel.detail.data);
        unlocked = isUnsealed(seals, sealKey);
      }
      catch(err) {
        console.log(err);
        unlocked = false;
      }
    }
    else {
      locked = false;
      unlocked = false;
    }
    updateState({ locked, unlocked, seals, sealKey });
  }, [account.state, conversation.state]);

  const setMemberItem = (contact, guids) => {
    return {
      cardId: contact?.cardId,
      name: contact?.profile?.name,
      handle: contact?.profile?.handle,
      node: contact?.profile?.node,
      logo: contact?.profile?.imageSet ? card.actions.getCardImageUrl(contact.cardId) : 'avatar',
      selected: guids.includes(contact?.profile?.guid),
    }
  };

  useEffect(() => {
    let unknown = 0;
    let members = new Map();
    const host = conversation.state.card;
    if (host) {
      members.set(host.card?.cardId, setMemberItem(host.card, []));
    }
    const guids = conversation.state.channel?.detail?.members || [];
    guids.forEach(guid => {
      if (guid !== profile.state.identity?.guid) {
        const contact = getCardByGuid(card.state.cards, guid);
        if (contact) {
          members.set(contact.card?.cardId, setMemberItem(contact.card, []));
        }
        else {
          unknown++;
        }
      }
    });

    const connected = new Map();
    card.state.cards.forEach(contact => {
      if (contact?.card?.detail?.status === 'connected') {
        connected.set(contact.card?.cardId, setMemberItem(contact.card, guids));
      }
    });

    updateState({ connected: Array.from(connected.values()), members: Array.from(members.values()), unknown });
  }, [card.state, conversation.state]);

  useEffect(() => {
    const hostId = conversation.state.card?.card.cardId;
    const profileGuid = profile.state.identity?.guid;
    const channel = conversation.state.channel;
    const cards = card.state.cards;
    const cardImageUrl = card.actions.getCardImageUrl;
    const { logo, subject } = getChannelSubjectLogo(hostId, profileGuid, channel, cards, cardImageUrl);

    let timestamp;
    const { created, data, dataType } = conversation.state.channel?.detail || {}
    const date = new Date(created * 1000);
    const now = new Date();
    const offset = now.getTime() - date.getTime();
    if(offset < 86400000) {
      timestamp = moment(date).format('h:mma');
    }
    else if (offset < 31449600000) {
      timestamp = moment(date).format('M/DD');
    }
    else {
      timestamp = moment(date).format('M/DD/YYYY');
    }

    let subjectUpdate;
    try {
      if (dataType === 'superbasic') {
        subjectUpdate = JSON.parse(data).subject;
      }
      else if (conversation.state?.channel?.unsealedDetail) {
        subjectUpdate = conversation.state?.channel?.unsealedDetail?.subject;
      }
    }
    catch(err) {
      console.log(err);
    }
    updateState({ hostId, logo, subject, timestamp, subjectUpdate });
  }, [conversation.state]);

  const actions = {
    showEditMembers: () => {
      updateState({ editMembers: true });
    },
    hideEditMembers: () => {
      updateState({ editMembers: false });
    },
    showEditSubject: () => {
      updateState({ editSubject: true });
    },
    hideEditSubject: () => {
      updateState({ editSubject: false });
    },
    setSubjectUpdate: (subjectUpdate) => {
      updateState({ subjectUpdate });
    },
    setCard: async (cardId) => {
      updateState({ connected: state.connected.map(contact => {
        if(contact.cardId === cardId) {
          return { ...contact, selected: true }
        }
        return contact;
      }) });
      await conversation.actions.setChannelCard(cardId);
    },
    clearCard: async (cardId) => {
      updateState({ connected: state.connected.map(contact => {
        if(contact.cardId === cardId) {
          return { ...contact, selected: false }
        }
        return contact;
      }) });
      await conversation.actions.clearChannelCard(cardId);
    },
    saveSubject: async () => {
      if (state.locked) {
        const contentKey = await getContentKey(state.seals, state.sealKey);
        const sealed = updateChannelSubject(state.subjectUpdate, contentKey);
        sealed.seals = state.seals;
        await conversation.actions.setChannelSubject('sealed', sealed);
      }
      else {
        const subject = { subject: state.subjectUpdate };
        await conversation.actions.setChannelSubject('superbasic', subject);
      }
    },
    removeTopic: async () => {
      await conversation.actions.removeChannel();
      clear();
    },
    blockTopic: async() => {
      await conversation.actions.setChannelFlag();
      clear();
    },
    reportTopic: async() => {
      await conversation.actions.addChannelAlert();
    },
    setNotifications: async (notification) => {
      await conversation.actions.setNotifications(notification);
      updateState({ notification });
    },
    deletePrompt: (action) => {
      display.actions.showPrompt({
        title: state.strings.deleteTopic,
        centerButtons: true,
        ok: { label: state.strings.confirmDelete, action, failed: () => {}},
        cancel: { label: state.strings.cancel },
      });
    },
    leavePrompt: (action) => {
      display.actions.showPrompt({
        title: state.strings.leaveTopic,
        centerButtons: true,
        ok: { label: state.strings.leave, action, failed: () => {}},
        cancel: { label: state.strings.cancel },
      });
    },
    blockPrompt: (action) => {
      display.actions.showPrompt({
        title: state.strings.blockTopic,
        centerButtons: true,
        ok: { label: state.strings.confirmBlock, action, failed: () => {}},
        cancel: { label: state.strings.cancel },
      });
    },
    reportPrompt: (action) => {
      display.actions.showPrompt({
        title: state.strings.reportTopic,
        centerButtons: true,
        ok: { label: state.strings.confirmReport, action, failed: () => {}},
        cancel: { label: state.strings.cancel },
      });
    },
  };

  return { state, actions };
}
