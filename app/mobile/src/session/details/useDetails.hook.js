import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConversationContext } from 'context/ConversationContext';
import { CardContext } from 'context/CardContext';
import { AccountContext } from 'context/AccountContext';
import { ProfileContext } from 'context/ProfileContext';
import { getChannelSubjectLogo } from 'context/channelUtil';
import { getChannelSeals, isUnsealed } from 'context/sealUtil';
import moment from 'moment';

export function useDetails() {

  const [state, setState] = useState({
    subject: null,
    created: null,
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
    const { channel, notification } = conversation.state;
    if (channel.detail.dataType === 'sealed') {
      locked = true;
      try {
        const { sealKey } = account.state;
        const seals = getChannelSeals(channel.detail.data);
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
    updateState({ locked, unlocked, notification });
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
    const cardId = conversation.state.card?.cardId;
    const profileGuid = profile.state.identity?.guid;
    const channel = conversation.state.channel;
    const cards = card.state.cards;
    const cardImageUrl = card.actions.getCardImageUrl;
    const { logo, subject } = getChannelSubjectLogo(cardId, profileGuid, channel, cards, cardImageUrl);
    const timestamp = conversation.state.channel?.detail?.created;

    let created;
    const date = new Date(item.detail.created * 1000);
    const now = new Date();
    const offset = now.getTime() - date.getTime();
    if(offset < 86400000) {
      created = moment(date).format('h:mma');
    }
    else if (offset < 31449600000) {
      created = moment(date).format('M/DD');
    }
    else {
      created = moment(date).format('M/DD/YYYY');
    }

    updateState({ logo, subject, created });
  }, [conversation]);

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
        await conversation.actions.setSealedSubject(state.subjectUpdate, account.state.sealKey);
      }
      else {
        await conversation.actions.setSubject(state.subjectUpdate);
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
