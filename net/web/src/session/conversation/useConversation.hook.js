import { useContext, useRef, useState, useEffect } from 'react';
import { ViewportContext } from 'context/ViewportContext';
import { AccountContext } from 'context/AccountContext';
import { ConversationContext } from 'context/ConversationContext';
import { UploadContext } from 'context/UploadContext';
import { StoreContext } from 'context/StoreContext';
import { CardContext } from 'context/CardContext';
import { ProfileContext } from 'context/ProfileContext';
import { isUnsealed, getChannelSeals, getContentKey } from 'context/sealUtil';
import { JSEncrypt } from 'jsencrypt'

import { decryptTopicSubject } from 'context/sealUtil';
import { getProfileByGuid } from 'context/cardUtil';

export function useConversation(cardId, channelId) {

  const [state, setState] = useState({
    display: null,
    upload: false,
    uploadError: false,
    uploadPercent: 0,
    topics: [],
    loading: false,
    sealed: false,
    contentKey: null,
  });

  const profile = useContext(ProfileContext);
  const card = useContext(CardContext);
  const account = useContext(AccountContext);
  const viewport = useContext(ViewportContext);  
  const conversation = useContext(ConversationContext);
  const upload = useContext(UploadContext);
  const store = useContext(StoreContext);

  const loading = useRef(false);
  const conversationId = useRef(null);
  const topics = useRef(new Map());

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  useEffect(() => {
    const { dataType, data } = conversation.state.channel?.data?.channelDetail || {};
    if (dataType === 'sealed') {
      try {
        const { sealKey } = account.state;
        const seals = getChannelSeals(data);
        if (isUnsealed(seals, sealKey)) {
          const contentKey = getContentKey(seals, sealKey);
          updateState({ sealed: true, contentKey });
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
  }, [account.state.sealKey, conversation.state.channel?.data?.channelDetail]);

  useEffect(() => {
    let active = false;
    let uploadError = false;
    let uploadPercent = 0;
    let uploadComplete = 0;
    let uploadCount = 0;
    let uploadActive = { loaded: 0, total: 0 };
    let uploadActiveCount = 0;

    const progress = upload.state.progress.get(`${cardId ? cardId : ''}:${channelId}`);

    if (progress) {
      progress.forEach((entry) => {
        active = true;
        if (entry.error) {
          uploadError = true;
        }
        uploadCount += entry.count;
        uploadComplete += (entry.index - 1);
        if (entry.active) {
          uploadActiveCount += 1;
          uploadActive.loaded += entry.active.loaded;
          uploadActive.total += entry.active.total;
        }
      });
      uploadPercent = (uploadComplete + (uploadActiveCount * (uploadActive.loaded / uploadActive.total))) / uploadCount;
      uploadPercent = Math.floor(uploadPercent * 100);
    }

    updateState({ upload: active, uploadError, uploadPercent });
  }, [cardId, channelId, upload.state]);
  
  const setChannel = async () => {
    if (!loading.current && conversationId.current) {
      const { card, channel } = conversationId.current;
      loading.current = true;
      conversationId.current = null;
      updateState({ loading: true, contentKey: null });
      await conversation.actions.setChannel(card, channel);
      updateState({ loading: false });
      loading.current = false;
      await setChannel();
    }
  }

  useEffect(() => {
    conversationId.current = { card: cardId, channel: channelId };
    setChannel();
    // eslint-disable-next-line
  }, [cardId, channelId]);

  const syncTopic = async (item, value) => {
    const revision = value.data?.detailRevision;
    const detail = value.data?.topicDetail || {};
    const identity = profile.state.identity || {};
    
    item.create = detail.created;
    const date = new Date(detail.created * 1000);
    const now = new Date();
    const offset = now.getTime() - date.getTime();
    if(offset < 86400000) {
      item.createdStr = date.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
    }
    else if (offset < 31449600000) {
      item.createdStr = date.toLocaleDateString("en-US", {day: 'numeric', month:'numeric'});
    }
    else {
      item.createdStr = date.toLocaleDateString("en-US");
    }

    if (detail.guid === identity.guid) {
      item.creator = true;
      item.imageUrl = profile.state.imageUrl;
      if (identity.name) {
        item.name = identity.name;
        item.nameSet = true;
      }
      else {
        item.name = `${identity.handle}@${identity.node}`;
        item.nameSet = false;
      }
    }
    else {
      item.creator = false;
      const contact = getProfileByGuid(card.state.cards, detail.guid);
      if (contact) {
        item.imageUrl = contact.imageSet ? card.actions.getCardImageUrl(contact.cardId) : null;
        if (contact.name) {
          item.name = contact.name;
          item.nameSet = true;
        }
        else {
          item.name = `${contact.handle}@${contact.node}`;
          item.nameSet = false;
        }
      }
      else {
        item.imageUrl = null;
        item.name = 'unknown';
        item.nameSet = false;
      }
    }

    if (detail.dataType === 'superbasictopic') {
      if (item.revision !== revision) {
        try {
          const message = JSON.parse(detail.data);
          item.assets = message.assets;
          item.text = message.text;
          item.textColor = message.textColor ? message.textColor : '#444444';
          item.textSize = message.textSize ? message.textSize : 14;
        }
        catch (err) {
          console.log(err);
        }
      }
    }
    if (detail.dataType === 'sealedtopic') {
      if (item.revision !== revision || item.contentKey !== state.contentKey) {
        item.contentKey = state.contentKey;
        try {
          const subject = decryptTopicSubject(detail.data, state.contentKey);
          item.assets = subject.message.assets;
          item.text = subject.message.text;
          item.textColor = subject.message.textColor ? subject.message.textColor : '#444444';
          item.textSize = subject.message.textSize ? subject.message.textSize : 14;
        }
        catch (err) {
          console.log(err);
        }
      }
    }
    item.transform = detail.transform;
    item.status = detail.status;
    item.assetUrl = conversation.actions.getTopicAssetUrl;
    item.revision = revision;
  };

  useEffect(() => {
    const messages = new Map();
    conversation.state.topics.forEach((value, id) => {
      let item = topics.current.get(id);
      if (!item) {
        item = { id };
      }
      syncTopic(item, value);
      messages.set(id, item);
    });
    topics.current = messages;

    const sorted = Array.from(messages.values()).sort((a, b) => {
      if(a.created === b.created) {
        return 0;
      }
      if(a.created == null || a.created < b.created) {
        return -1;
      }
      return 1;
    });

    updateState({ topics: sorted });
    // eslint-disable-next-line
  }, [conversation.state, profile.state, card.state, state.contentKey]);

  const actions = {
    more: () => {
      conversation.actions.loadMore();
    },
    resync: () => {
      conversation.actions.resync();
    },
    clearUploadErrors: (cardId, channelId) => {
      upload.actions.clearErrors(cardId, channelId);
    },
    cancelUpload: () => {
    },
  };

  return { state, actions };
}

