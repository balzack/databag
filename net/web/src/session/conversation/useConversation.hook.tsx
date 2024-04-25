import { useContext, useRef, useState, useEffect } from 'react';
import { SettingsContext } from 'context/SettingsContext';
import { AccountContext } from 'context/AccountContext';
import { ConversationContext } from 'context/ConversationContext';
import { UploadContext } from 'context/UploadContext';
import { StoreContext } from 'context/StoreContext';
import { CardContext } from 'context/CardContext';
import { ProfileContext } from 'context/ProfileContext';
import { isUnsealed, getChannelSeals, getContentKey, encryptTopicSubject } from 'context/sealUtil';
import { decryptTopicSubject } from 'context/sealUtil';
import { getProfileByGuid } from 'context/cardUtil';
import * as DOMPurify from 'dompurify';

export function useConversation(cardId, channelId) {
  const [state, setState] = useState({
    display: null,
    upload: false,
    uploadError: false,
    uploadPercent: 0,
    topics: [],
    sealed: false,
    contentKey: null,
    busy: false,
    colors: {},
    strings: {} as Record<string, string>,
    menuStyle: {},
  });

  const profile = useContext(ProfileContext);
  const card = useContext(CardContext);
  const account = useContext(AccountContext);
  const settings = useContext(SettingsContext);
  const conversation = useContext(ConversationContext);
  const upload = useContext(UploadContext);
  const store = useContext(StoreContext);

  const loading = useRef(false);
  const conversationId = useRef(null);
  const topics = useRef(new Map());

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  };

  useEffect(() => {
    const { strings, menuStyle, display, colors } = settings.state;
    updateState({ strings, menuStyle, display, colors });
  }, [settings.state]);

  useEffect(() => {
    const { dataType, data } = conversation.state.channel?.data?.channelDetail || {};
    if (dataType === 'sealed') {
      try {
        const { sealKey } = account.state;
        const seals = getChannelSeals(data);
        if (isUnsealed(seals, sealKey)) {
          const contentKey = getContentKey(seals, sealKey);
          updateState({ sealed: true, wtf: true, contentKey });
        } else {
          updateState({ sealed: true, contentKey: null });
        }
      } catch (err) {
        console.log(err);
        updateState({ sealed: true, contentKey: null });
      }
    } else {
      updateState({ sealed: false, contentKey: null });
    }
    // eslint-disable-next-line
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
        uploadComplete += entry.index - 1;
        if (entry.active) {
          uploadActiveCount += 1;
          uploadActive.loaded += entry.active.loaded;
          uploadActive.total += entry.active.total;
        }
      });
      uploadPercent = (uploadComplete + uploadActiveCount * (uploadActive.loaded / uploadActive.total)) / uploadCount;
      uploadPercent = Math.floor(uploadPercent * 100);
    }

    updateState({ upload: active, uploadError, uploadPercent });
  }, [cardId, channelId, upload.state]);

  const setChannel = async () => {
    if (!loading.current && conversationId.current) {
      const { card, channel } = conversationId.current;
      loading.current = true;
      conversationId.current = null;
      await conversation.actions.setChannel(card, channel);
      loading.current = false;
      await setChannel();
    }
  };

  useEffect(() => {
    conversationId.current = { card: cardId, channel: channelId };
    setChannel();
    // eslint-disable-next-line
  }, [cardId, channelId]);

  useEffect(() => {
    const key = `${conversation.state.channel?.id}::${conversation.state.card?.id}`;
    const topicRevision = conversation.state.channel?.data?.topicRevision;
    store.actions.setValue(key, topicRevision);

    syncChannel();
    // eslint-disable-next-line
  }, [conversation.state, profile.state, card.state, settings.state]);

  useEffect(() => {
    topics.current = new Map();
    syncChannel();
    // eslint-disable-next-line
  }, [state.contentKey]);

  const clickableText = (text) => {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator

    const hostPattern = new RegExp('^https?:\\/\\/', 'i');

    let group = '';
    let clickable = [];
    const words = text === '' ? '' : DOMPurify.sanitize(text).split(' ');
    words.forEach((word, index) => {
      if (!!urlPattern.test(word)) {
        clickable.push(<span key={index}>{group}</span>);
        group = '';
        const url = !!hostPattern.test(word) ? word : `https://${word}`;
        clickable.push(
          <a
            key={'link-' + index}
            target="_blank"
            rel="noopener noreferrer"
            href={url}
          >{`${word} `}</a>,
        );
      } else {
        group += `${word} `;
      }
    });
    clickable.push(<span key={words.length}>{group}</span>);
    return <p>{clickable}</p>;
  };

  const syncTopic = (item, value) => {
    const revision = value.data?.detailRevision;
    const detail = value.data?.topicDetail || {};
    const identity = profile.state.identity || {};

    item.created = detail.created;
    const date = new Date(detail.created * 1000);
    const now = new Date();
    const offset = now.getTime() - date.getTime();
    if (offset < 86400000) {
      if (settings.state.timeFormat === '12h') {
        item.createdStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      } else {
        item.createdStr = date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' });
      }
    } else if (offset < 31449600000) {
      if (settings.state.dateFormat === 'mm/dd') {
        item.createdStr = date.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric' });
      } else {
        item.createdStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric' });
      }
    } else {
      if (settings.state.dateFormat === 'mm/dd') {
        item.createdStr = date.toLocaleDateString('en-US');
      } else {
        item.createdStr = date.toLocaleDateString('en-GB');
      }
    }

    if (detail.guid === identity.guid) {
      item.creator = true;
      item.imageUrl = profile.state.imageUrl;
      if (identity.name) {
        item.name = identity.name;
        item.nameSet = true;
      } else {
        item.name = identity.node
          ? `${identity.handle}/${identity.node}`
          : identity.handle
            ? identity.handle
            : 'unknown';
        item.nameSet = false;
      }
    } else {
      item.creator = false;
      const contact = getProfileByGuid(card.state.cards, detail.guid);
      if (contact) {
        item.imageUrl = contact.imageSet ? card.actions.getCardImageUrl(contact.cardId) : null;
        if (contact.name) {
          item.name = contact.name;
          item.nameSet = true;
        } else {
          item.name = contact.node ? `${contact.handle}/${contact.node}` : contact.handle ? contact.handle : 'unknown';
          item.nameSet = false;
        }
      } else {
        item.imageUrl = null;
        item.name = 'unknown';
        item.nameSet = false;
      }
    }

    if (item.revision !== revision) {
      try {
        if (detail.dataType === 'superbasictopic') {
          const message = JSON.parse(detail.data);
          item.assets = message.assets;
          item.text = message.text;
          item.clickable = clickableText(message.text);
          item.textColor = message.textColor ? message.textColor : null;
          item.textSize = message.textSize ? message.textSize : 14;
        }
        if (detail.dataType === 'sealedtopic' && state.contentKey) {
          const subject = decryptTopicSubject(detail.data, state.contentKey);
          item.assets = subject.message.assets;
          item.text = subject.message.text;
          item.clickable = clickableText(subject.message.text);
          item.textColor = subject.message.textColor ? subject.message.textColor : null;
          item.textSize = subject.message.textSize ? subject.message.textSize : 14;
        }
      } catch (err) {
        console.log(err);
      }
      item.revision = revision;
    }
    item.transform = detail.transform;
    item.status = detail.status;
    item.assetUrl = conversation.actions.getTopicAssetUrl;
  };

  const syncChannel = () => {
    const messages = new Map();
    conversation.state.topics.forEach((value, id) => {
      const curCardId = conversation.state.card?.id;
      const curChannelId = conversation.state.channel?.id;
      const key = `${curCardId}:${curChannelId}:${id}`;
      let item = topics.current.get(key);
      if (!item) {
        item = { id };
      }
      syncTopic(item, value);
      messages.set(key, item);
    });
    topics.current = messages;

    const sorted = Array.from(messages.values()).sort((a, b) => {
      if (a.created === b.created) {
        return 0;
      }
      if (a.created == null || a.created < b.created) {
        return -1;
      }
      return 1;
    });

    updateState({ topics: sorted });
  };

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
    cancelUpload: () => {},
    removeTopic: async (topicId) => {
      await conversation.actions.removeTopic(topicId);
    },
    updateTopic: async (topic, text) => {
      const { assets, textSize, textColor } = topic;
      const message = { text, textSize, textColor, assets };

      if (!state.busy) {
        updateState({ busy: true });
        try {
          if (state.sealed) {
            if (state.contentKey) {
              const subject = encryptTopicSubject({ message }, state.contentKey);
              await conversation.actions.setTopicSubject(topic.id, 'sealedtopic', subject);
            }
          } else {
            await conversation.actions.setTopicSubject(topic.id, 'superbasictopic', message);
          }
          updateState({ busy: false });
        } catch (err) {
          updateState({ busy: false });
          throw new Error('topic update failed');
        }
      } else {
        throw new Error('operation in progress');
      }
    },
  };

  return { state, actions };
}
