import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConversationContext } from 'context/ConversationContext';
import { CardContext } from 'context/CardContext';
import { AccountContext } from 'context/AccountContext';
import { ProfileContext } from 'context/ProfileContext';
import { getChannelSubjectLogo } from 'context/channelUtil';
import { getChannelSeals, isUnsealed, getContentKey, updateChannelSubject } from 'context/sealUtil';
import moment from 'moment';

export function useDetails() {

  const [state, setState] = useState({
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
    count: 0,
    seals: null,
    sealKey: null,
  });

  const card = useContext(CardContext);
  const account = useContext(AccountContext);
  const conversation = useContext(ConversationContext);
  const profile = useContext(ProfileContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    let locked;
    let unlocked;
    let seals;
    let sealKey;
    const { channel, notification } = conversation.state;
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
    updateState({ locked, unlocked, seals, sealKey, notification });
  }, [account.state, conversation.state]);

  useEffect(() => {
    const connected = [];
    card.state.cards.forEach(contact => {
      if (contact?.card?.detail?.status === 'connected') {
        connected.push(contact.card);
      }
    });
    updateState({ connected });
  }, [card.state]);

  useEffect(() => {
    const hostId = conversation.state.card?.cardId;
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
    remove: async () => {
      await conversation.actions.removeChannel();
    },
    block: async() => {
      await conversation.actions.setChannelFlag();
    },
    report: async() => {
      await conversation.actions.addChannelAlert();
    },
    setNotifications: async (notification) => {
      await conversation.actions.setNotifications(notification);
    },
  };

  return { state, actions };
}
