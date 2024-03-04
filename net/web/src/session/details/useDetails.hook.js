import { useContext, useState, useEffect, useRef } from 'react';
import { CardContext } from 'context/CardContext';
import { ConversationContext } from 'context/ConversationContext';
import { AccountContext } from 'context/AccountContext';
import { ProfileContext } from 'context/ProfileContext';
import { SettingsContext } from 'context/SettingsContext';
import { getCardByGuid } from 'context/cardUtil';
import { decryptChannelSubject, updateChannelSubject, getContentKey, getChannelSeals, isUnsealed } from 'context/sealUtil';

export function useDetails() {

  const [state, setState] = useState({
    logo: null,
    img: null,
    started: null,
    host: null,
    title: null,
    label: null,
    members: [],
    unknown: 0,

    showEditMembers: false,
    editMembers: new Set(),

    showEditSubject: false,
    editSubject: null,

    strings: {},
    display: 'small',
    menuStyle: {},
    sealed: false,
    contentKey: null,
    seals: null,
  });

  const conversation = useContext(ConversationContext);
  const card = useContext(CardContext);
  const account = useContext(AccountContext);
  const settings = useContext(SettingsContext);
  const profile = useContext(ProfileContext);

  const cardId = useRef();
  const channelId = useRef();
  const key = useRef();
  const detailRevision = useRef();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { dataType, data } = conversation.state.channel?.data?.channelDetail || {};
    if (dataType === 'sealed') {
      try {
        const { sealKey } = account.state;
        const seals = getChannelSeals(data);
        if (isUnsealed(seals, sealKey)) {
          const decKey = getContentKey(seals, sealKey);
          updateState({ sealed: true, contentKey: decKey, seals });
        }
        else {
          updateState({ sealed: true, contentKey: null });
        }
      }
      catch (err) {
        console.log(err);
        updateState({ sealed: true, contentKey: null });
      }
    }
    else {
      updateState({ sealed: false, contentKey: null });
    }
    // eslint-disable-next-line
  }, [account.state.sealKey, conversation.state.channel?.data?.channelDetail]);

  useEffect(() => {
    const { menuStyle, strings, display } = settings.state;
    updateState({ menuStyle, strings, display });
  }, [settings.state]);

  useEffect(() => {

    const cardValue = conversation.state.card;
    const channelValue = conversation.state.channel;

    // extract channel created info
    let started;
    let host;
    const date = new Date(channelValue?.data?.channelDetail?.created * 1000);
    const now = new Date();
    if(now.getTime() - date.getTime() < 86400000) {
      started = date.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
    }
    else {
      started = date.toLocaleDateString("en-US");
    }
    if (cardValue) {
      host = cardValue.id;
    }
    else {
      host = null;
    }

    // extract member info
    let memberCount = 0;
    let names = [];
    let img;
    let logo;
    let members = [];
    let unknown = 0;
    if (cardValue) {
      members.push(cardValue.id);
      const profile = cardValue.data?.cardProfile;
      if (profile?.name) {
        names.push(profile.name);
      }
      if (profile?.imageSet) {
        img = null;
        logo = card.actions.getCardImageUrl(cardValue.id);
      }
      else {
        img = 'avatar';
        logo = null;
      }
      memberCount++;
    }
    if (channelValue?.data?.channelDetail?.members) {
      for (let guid of channelValue.data.channelDetail.members) {
        if (guid !== profile.state.identity.guid) {
          const contact = getCardByGuid(card.state.cards, guid);
          if (contact) {
            members.push(contact.id);
          }
          else {
            unknown++;
          }
    
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
    }

    let label;
    if (memberCount === 0) {
      img = 'solution';
      label = 'Notes';
    }
    else if (memberCount === 1) {
      label = names.join(',');
    }
    else {
      img = 'appstore';
      label = names.join(',');
    }

    if (cardId.current !== cardValue?.id || channelId.current !== channelValue?.id ||
        detailRevision.current !== channelValue?.data?.detailRevision || key.current !== state.contentKey) {
      let title;
      try {
        const detail = channelValue?.data?.channelDetail;
        if (detail?.dataType === 'sealed') {
          if (state.contentKey) {
            const unsealed = decryptChannelSubject(detail.data, state.contentKey);
            title = unsealed.subject;
          }
          else {
            title = '...';
          }
        }
        else if (detail?.dataType === 'superbasic') {
          const data = JSON.parse(detail.data);
          title = data.subject;
        }
      }
      catch(err) {
        console.log(err);
      }
      cardId.current = cardValue?.id;
      channelId.current = channelValue?.id;
      detailRevision.current = channelValue?.data?.detailRevision;
      key.current = state.contentKey;
      updateState({ started, host, title, label, img, logo, unknown, members,
        editSubject: title, editMembers: new Set(members) });
    }
    else {
      updateState({ started, host, label, img, logo, unknown, members,
        editMembers: new Set(members) });
    }
    // eslint-disable-next-line
  }, [conversation.state, card.state, state.contentKey]);

  const actions = {
    setEditSubject: () => {
      updateState({ showEditSubject: true });
    },
    clearEditSubject: () => {
      updateState({ showEditSubject: false });
    },
    setSubjectUpdate: (editSubject) => {
      updateState({ editSubject });
    },
    setSubject: async () => {
      if (state.sealed) {
        if (state.contentKey) {
          const updated = updateChannelSubject(state.editSubject, state.contentKey);
          updated.seals = state.seals;
          await conversation.actions.setChannelSubject('sealed', updated);
        }
      }
      else {
        const subject = { subject: state.editSubject };
        await conversation.actions.setChannelSubject('superbasic', subject);
      }
    },
    setEditMembers: () => {
      updateState({ editMembers: new Set(state.members), showEditMembers: true });
    },
    clearEditMembers: () => {
      updateState({ showEditMembers: false });
    },
    setMember: async (id) => {
      await conversation.actions.setChannelCard(id);
    },
    clearMember: async (id) => {
      await conversation.actions.clearChannelCard(id);
    },
    removeChannel: async () => {
      await conversation.actions.removeChannel();
    },
  };

  return { state, actions };
}

