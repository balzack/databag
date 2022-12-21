import { useContext, useState, useEffect } from 'react';
import { ViewportContext } from 'context/ViewportContext';
import { AccountContext } from 'context/AccountContext';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';
import { ConversationContext } from 'context/ConversationContext';
import { UploadContext } from 'context/UploadContext';
import { StoreContext } from 'context/StoreContext';
import CryptoJS from 'crypto-js';
import { JSEncrypt } from 'jsencrypt'

export function useConversation(cardId, channelId) {

  const [state, setState] = useState({
    display: null,
    logo: null,
    subject: null,
    topics: [],
    loadingInit: false,
    loadingMore: false,
    upload: false,
    uploadError: false,
    uploadPercent: 0,
    error: false,
    sealed: false,
    sealKey: null,
    delayed: false,
  });

  const account = useContext(AccountContext);
  const viewport = useContext(ViewportContext);  
  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const conversation = useContext(ConversationContext);
  const upload = useContext(UploadContext);
  const store = useContext(StoreContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  useEffect(() => {
    let sealKey;
    const seals = conversation.state.seals;
    if (seals?.length > 0) {
      seals.forEach(seal => {
        if (seal.publicKey === account.state.sealKey?.public) {
          let crypto = new JSEncrypt();
          crypto.setPrivateKey(account.state.sealKey.private);
          sealKey = crypto.decrypt(seal.sealedKey);
        }
      });
    }
    updateState({ sealed: conversation.state.sealed, sealKey });
  }, [account.state.sealKey, conversation.state.seals, conversation.state.sealed]);

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
  }, [cardId, channelId, upload]);

  useEffect(() => {
    updateState({ delayed: false, topics: [] });
    setTimeout(() => {
      updateState({ delayed: true });
    }, 250);
    conversation.actions.setConversationId(cardId, channelId);
    // eslint-disable-next-line
  }, [cardId, channelId]);

  useEffect(() => {
    let topics = Array.from(conversation.state.topics.values()).sort((a, b) => {
      const aTimestamp = a?.data?.topicDetail?.created;
      const bTimestamp = b?.data?.topicDetail?.created;
      if(aTimestamp === bTimestamp) {
        return 0;
      }
      if(aTimestamp == null || aTimestamp < bTimestamp) {
        return -1;
      }
      return 1;
    });
    if (topics.length) {
      updateState({ delayed: false });
    }
    else {
      setTimeout(() => {
        updateState({ delayed: true });
      }, 250);
    }
    const { error, loadingInit, loadingMore, subject, logoUrl, logoImg } = conversation.state;
    updateState({ topics, error, loadingInit, loadingMore, subject, logoUrl, logoImg });
    store.actions.setValue(`${channelId}::${cardId}`, Number(conversation.state.revision));
    // eslint-disable-next-line 
  }, [conversation]);

  const actions = {
    more: () => {
      conversation.actions.addHistory();
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

