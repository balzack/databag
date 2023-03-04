import { useEffect, useState, useContext, useRef } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { CardContext } from 'context/CardContext';
import { AccountContext } from 'context/AccountContext';
import { ConversationContext } from 'context/ConversationContext';
import { getChannelSubjectLogo } from 'context/channelUtil';
import { getChannelSeals, isUnsealed, getContentKey, encryptTopicSubject, decryptTopicSubject } from 'context/sealUtil';

export function useConversation() {
  const [state, setState] = useState({
    subject: null,
    logo: null,
    topic: [],
    loaded: false,
    contentKey: null,
    focus: null,
    editing: false,
    editTopicId: null,
    editType: null,
    editMessage: null,
    editData: null,
    updateBusy: false,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const profile = useContext(ProfileContext);
  const card = useContext(CardContext);
  const conversation = useContext(ConversationContext);
  const account = useContext(AccountContext);

  const contentKey = useRef();
  const keyId = useRef();

  useEffect(() => {
    setContentKey();
  }, [conversation.state, account.state]);

  const setContentKey = async () => {
    const type = conversation.state.channel?.detail?.dataType;
    if (type === 'sealed') {
      const cardId = conversation.state.card?.card?.cardId;
      const channelId = conversation.state.channel?.channelId;
      const contentId = `${cardId}:${channelId}`;
      if (contentId !== keyId.current) {
        const channelDetail = conversation.state.channel?.detail;
        const seals = getChannelSeals(channelDetail?.data);
        const sealKey = account.state.sealKey;
        if (isUnsealed(seals, sealKey)) {
          contentKey.current = await getContentKey(seals, sealKey);
          keyId.current = contentId;
          updateState({ contentKey: contentKey.current });
        }
        else if (keyId.current != null) {
          contentKey.current = null;
          keyId.current = null;
          updateState({ contentKey: null });
        }
      }
    }
    else if (keyId.current != null) {
      contentKey.current = null;
      keyId.current = null;
      updateState({ contentKey: null });
    }
  };

  useEffect(() => {
    const loaded = conversation.state.loaded;
    const cardId = conversation.state.card?.cardId;
    const profileGuid = profile.state.identity?.guid;
    const channel = conversation.state.channel;
    const cards = card.state.cards;
    cardImageUrl = card.actions.getCardImageUrl;
    const { logo, subject } = getChannelSubjectLogo(cardId, profileGuid, channel, cards, cardImageUrl);

    const items = Array.from(conversation.state.topics.values());
    const sorted = items.sort((a, b) => {
      const aTimestamp = a?.detail?.created;
      const bTimestamp = b?.detail?.created;
      if(aTimestamp === bTimestamp) {
        return 0;
      }
      if(aTimestamp == null || aTimestamp < bTimestamp) {
        return 1;
      }
      return -1;
    });
    const filtered = sorted.filter(item => !(item.blocked === 1));

    updateState({ loaded, logo, subject, topics: filtered });
  }, [conversation.state, profile.state]);
    

  const actions = {
    setFocus: (focus) => {
      updateState({ focus });
    },
    editTopic: async (topicId, type, data) => {
      console.log("EDIT:", topicId, type, data);
      updateState({ editing: true, editTopicId: topicId, editType: type, editMessage: data?.text, editData: data });
    },
    hideEdit: () => {
      updateState({ editing: false });
    },
    setEditMessage: (editMessage) => {
      updateState({ editMessage });
    },
    updateTopic: async () => {
      if (!state.updateBusy) {
        try {
          updateState({ updateBusy: true });
          const message = { ...state.editData, text: state.editMessage };
          if (state.editType === 'superbasictopic') {
            await conversation.actions.setTopicSubject(state.editTopicId, state.editType, message);
          }
          else {
            const sealed = encryptTopicSubject({ message }, state.contentKey);
            await conversation.actions.setTopicSubject(state.editTopicId, state.editType, sealed);
          }
          updateState({ updateBusy: false }); 
        }
        catch(err) {
          console.log(err);
          updateState({ updateBusy: false });
          throw new Error("failed to update");
        }
      }    
    },
    removeTopic: async (topicId) => {
      await conversation.actions.removeTopic(topicId);
    },
  };

  return { state, actions };
}

