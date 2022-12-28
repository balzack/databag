import { useState, useRef, useContext } from 'react';
import { StoreContext } from 'context/StoreContext';
import { UploadContext } from 'context/UploadContext';
import { getChannels } from 'api/getChannels';
import { getChannelDetail } from 'api/getChannelDetail';
import { getChannelSummary } from 'api/getChannelSummary';
import { addChannel } from 'api/addChannel';
import { removeChannel } from 'api/removeChannel';
import { removeChannelTopic } from 'api/removeChannelTopic';
import { setChannelTopicSubject } from 'api/setChannelTopicSubject';
import { addChannelTopic } from 'api/addChannelTopic';
import { getChannelTopics } from 'api/getChannelTopics';
import { getChannelTopic } from 'api/getChannelTopic';
import { getChannelTopicAssetUrl } from 'api/getChannelTopicAssetUrl';
import { setChannelSubject } from 'api/setChannelSubject';
import { setChannelCard } from 'api/setChannelCard';
import { clearChannelCard } from 'api/clearChannelCard';
import { addFlag } from 'api/addFlag';
import { setChannelNotifications } from 'api/setChannelNotifications';
import { getChannelNotifications } from 'api/getChannelNotifications';
import CryptoJS from "crypto-js";
import { RSA } from 'react-native-rsa-native';

export function useChannelContext() {
  const [state, setState] = useState({
    channels: new Map(),
  });
  const store = useContext(StoreContext);
  const upload = useContext(UploadContext);

  const session = useRef(null);
  const curRevision = useRef(null);
  const setRevision = useRef(null);
  const syncing = useRef(false);
  const channels = useRef(new Map());

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const unsealKey = async (seals, sealKey) => {
    let seal;
    if (seals?.length) {
      seals.forEach(s => {
        if (s.publicKey === sealKey.public) {
          seal = s;
        }
      });
    }
    if (seal) {
    const key = '-----BEGIN RSA PRIVATE KEY-----\n' + sealKey.private + '\n-----END RSA PRIVATE KEY-----'
    return await RSA.decrypt(seal.sealedKey, key);
    }
    return null;
  };

  const setChannel = (channelId, channel) => {
    let update = channels.current.get(channelId);
    if (!update) {
      update = { readRevision: 0 };
    }
    update.channelId = channel?.id;
    update.revision = channel?.revision;
    update.detail = channel?.data?.channelDetail;
    update.unsealedDetail = null;
    update.summary = channel?.data?.channelSummary;
    update.unsealedSummary = null;
    update.detailRevision = channel?.data?.detailRevision;
    update.topicRevision = channel?.data?.topicRevision;
    channels.current.set(channelId, update);
  }
  const setChannelDetail = (channelId, detail, revision) => {
    let channel = channels.current.get(channelId);
    if (channel) {
      channel.detail = detail;
      channel.unsealedDetail = null;
      channel.detailRevision = revision;
      channels.current.set(channelId, channel);
    }
  }
  const setChannelSummary = (channelId, summary, revision) => {
    let channel = channels.current.get(channelId);
    if (channel) {
      channel.summary = summary;
      channel.unsealedSummary = null;
      channel.topicRevision = revision;
      channels.current.set(channelId, channel);
    }
  }
  const setChannelRevision = (channelId, revision) => {
    let channel = channels.current.get(channelId);
    if (channel) {
      channel.revision = revision;
      channels.current.set(channelId, channel);
    }
  }
  const setChannelReadRevision = (channelId, revision) => {
    let channel = channels.current.get(channelId);
    if (channel) {
      channel.readRevision = revision;
      channels.current.set(channelId, channel);
    }
  }
  const setChannelSyncRevision = (channelId, revision) => {
    let channel = channels.current.get(channelId);
    if (channel) {
      channel.syncRevision = revision;
      channels.current.set(channelId, channel);
    }
  }
  const setChannelTopicMarker = (channelId, marker) => {
    let channel = channels.current.get(channelId);
    if (channel) {
      channel.topicMarker = marker;
      channels.current.set(channelId, channel);
    }
  }
  const setChannelBlocked = (channelId, blocked) => {
    let channel = channels.current.get(channelId);
    if (channel) {
      channel.blocked = blocked;
      channels.current.set(channelId, channel);
    }
  }

  const sync = async () => {

    if (!syncing.current && setRevision.current !== curRevision.current) {
      syncing.current = true;

      try {
        const revision = curRevision.current;
        const { server, appToken, guid } = session.current;

        const delta = await getChannels(server, appToken, setRevision.current);
        for (let channel of delta) {
          if (channel.data) {
            if (channel.data.channelDetail && channel.data.channelSummary) {
              await store.actions.setChannelItem(guid, channel);
              setChannel(channel.id, channel);
            }
            else {
              const { detailRevision, topicRevision, channelDetail, channelSummary } = channel.data;
              const view = await store.actions.getChannelItemView(guid, channel.id);
              if (view == null) {
                let assembled = JSON.parse(JSON.stringify(channel));
                assembled.data.channelDetail = await getChannelDetail(server, appToken, channel.id);
                assembled.data.channelSummary = await getChannelSummary(server, appToken, channel.id);
                await store.actions.setChannelItem(guid, assembled);
                setChannel(assembled.id, assembled);
              }
              else {
                if (view.detailRevision != detailRevision) {
                  const detail = await getChannelDetail(server, appToken, channel.id);
                  await store.actions.setChannelItemDetail(guid, channel.id, detailRevision, detail);
                  setChannelDetail(channel.id, detail, detailRevision);
                }
                if (view.topicRevision != topicRevision) {
                  const summary = await getChannelSummary(server, appToken, channel.id);
                  await store.actions.setChannelItemSummary(guid, channel.id, topicRevision, summary);
                  setChannelSummary(channel.id, summary, topicRevision);
                }
                await store.actions.setChannelItemRevision(guid, channel.id, channel.revision);
                setChannelRevision(channel.id, channel.revision);
              }
            }
          }
          else {
            await store.actions.clearChannelItem(guid, channel.id);
            channels.current.delete(channel.id);
          }
        }

        setRevision.current = revision;
        await store.actions.setChannelRevision(guid, revision);
        updateState({ channels: channels.current });
      }
      catch(err) {
        console.log(err);
        syncing.current = false;
        return;
      }

      syncing.current = false;
      sync();
    }
  };

  const actions = {
    setSession: async (access) => {
      const { guid, server, appToken } = access;
      channels.current = new Map();
      const items = await store.actions.getChannelItems(guid);
      for(item of items) {
        channels.current.set(item.channelId, item);
      }
      const revision = await store.actions.getChannelRevision(guid);
      updateState({ channels: channels.current });
      setRevision.current = revision;
      curRevision.current = revision;
      session.current = access;
    },
    clearSession: () => {
      session.current = {};
      channels.current = new Map();
      updateState({ account: null, channels: channels.current });
    },
    setRevision: (rev) => {
      curRevision.current = rev;
      sync();
    },
    setReadRevision: async (channelId, rev) => {
      await store.actions.setChannelItemReadRevision(session.current.guid, channelId, rev);
      setChannelReadRevision(channelId, rev);
      updateState({ channels: channels.current }); 
    },
    setSyncRevision: async (channelId, revision) => {
      const { guid } = session.current;
      await store.actions.setChannelItemSyncRevision(guid, channelId, revision);
      setChannelSyncRevision(channelId, revision);
      updateState({ channels: channels.current }); 
    },
    setTopicMarker: async (channelId, marker) => {
      const { guid } = session.current;
      await store.actions.setChannelItemTopicMarker(guid, channelId, marker);
      setChannelTopicMarker(channelId, marker);
      updateState({ channels: channels.current }); 
    },
    setBlocked: async (channelId) => {
      const { guid } = session.current;
      await store.actions.setChannelItemBlocked(guid, channelId);
      setChannelBlocked(channelId, 1);
      updateState({ channels: channels.current }); 
    },
    clearBlocked: async (channelId) => {
      const { guid } = session.current;
      await store.actions.clearChannelItemBlocked(guid, channelId);
      setChannelBlocked(channelId, 0);
      updateState({ channels: channels.current }); 
    },
    setTopicBlocked: async (channelId, topicId) => {
      const { guid } = session.current;
      await store.actions.setChannelTopicBlocked(guid, channelId, topicId, true);
    },
    clearTopicBlocked: async (channelId, topicId) => {
      const { guid } = session.current;
      await store.actions.setChannelTopicBlocked(guid, channelId, topicId, false);
    },
    getTopicBlocked: async () => {
      const { guid } = session.current;
      return await store.actions.getChannelTopicBlocked(guid);
    },
    getTopicItems: async (channelId) => {
      const { guid } = session.current;
      return await store.actions.getChannelTopicItems(guid, channelId);
    },
    setTopicItem: async (channelId, topicId, topic) => {
      const { guid } = session.current;
      return await store.actions.setChannelTopicItem(guid, channelId, topicId, topic);
    },
    clearTopicItem: async (channelId, topicId) => {
      const { guid } = session.current;
      return await store.actions.clearChannelTopicItem(guid, channelId, topicId);
    },
    clearTopicItems: async (channelId) => {
      const { guid } = session.current;
      return await store.actions.clearChannelTopicItems(guid, channelId);
    },
    getTopic: async (channelId, topicId) => {
      const { server, appToken } = session.current;
      return await getChannelTopic(server, appToken, channelId, topicId);
    },
    getTopics: async (channelId, revision, count, begin, end) => {
      const { server, appToken } = session.current;
      return await getChannelTopics(server, appToken, channelId, revision, count, begin, end);
    },
    getTopicAssetUrl: (channelId, topicId, assetId) => {
      const { server, appToken } = session.current;
      return getChannelTopicAssetUrl(server, appToken, channelId, topicId, assetId);
    },
    addTopic: async (channelId, message, files) => {
      const { server, appToken } = session.current;
      if (files?.length > 0) {
        const topicId = await addChannelTopic(server, appToken, channelId, null, null, null);
        upload.actions.addTopic(server, appToken, channelId, topicId, files, async (assets) => {
          message.assets = assets;
          await setChannelTopicSubject(server, appToken, channelId, topicId, 'superbasictopic', message);
        }, async () => {
          try {
            await removeChannelTopic(server, appToken, channelId, topicId);
          }
          catch (err) {
            console.log(err);
          }
        });
      }
      else {
        await addChannelTopic(server, appToken, channelId, 'superbasictopic', message, []);
      }
    },
    addSealedTopic: async (channelId, message, sealKey) => {
      const { server, appToken } = session.current;
      const iv = CryptoJS.lib.WordArray.random(128 / 8);
      const key = CryptoJS.enc.Hex.parse(sealKey);
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ message }), key, { iv: iv });
      const messageEncrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
      const messageIv = iv.toString();
      await addChannelTopic(server, appToken, channelId, 'sealedtopic', { messageEncrypted, messageIv });
    },
    setTopicSubject: async (channelId, topicId, dataType, data) => {
      const { server, appToken } = session.current;
      return await setChannelTopicSubject(server, appToken, channelId, topicId, dataType, data);
    },
    setTopicUnsealedDetail: async (channelId, topicId, revision, unsealed) => {
      const { guid } = session.current;
      await store.actions.setChannelTopicItemUnsealedDetail(guid, channelId, topicId, revision, unsealed);
    },
    setTopicUnsealedSummary: async (channelId, topicId, revision, unsealed) => {
      const { guid } = seassion.current;
      await store.actions.setChannelTopicItemUnsealedSummary(guid, channelId, topicId, revision, unsealed);
    },
    setSubject: async (channelId, subject) => {
      const { server, appToken } = session.current;
      return await setChannelSubject(server, appToken, channelId, 'superbasic', { subject });
    },
    setSealedSubject: async (channelId, subject, sealKey) => {
      const { server, appToken } = session.current;
      const channel = channels.current.get(channelId);

      let { seals, subjectEncrypted, subjectIv } = JSON.parse(channel.detail.data);
      const unsealedKey = await unsealKey(seals, sealKey);
      if (!unsealedKey) {
        throw new Error("cannot reseal subject");
      }
      const key = CryptoJS.enc.Hex.parse(unsealedKey);
      const iv = CryptoJS.lib.WordArray.random(128 / 8);
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ subject }), key, { iv: iv });
      subjectEncrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
      subjectIv = iv.toString();
      const data = { subjectEncrypted, subjectIv, seals };
      return await setChannelSubject(server, appToken, channelId, 'sealed', data);
    },
    remove: async (channelId) => {
      const { server, appToken } = session.current;
      return await removeChannel(server, appToken, channelId);
    },
    addBasic: async (subject, cards) => {
      const { server, appToken } = session.current;
      return await addChannel(server, appToken, 'superbasic', { subject }, cards);
    },
    addSealed: async (subject, cards, keys) => {
      const { server, appToken } = session.current;

      const key = CryptoJS.lib.WordArray.random(256 / 8);
      const iv = CryptoJS.lib.WordArray.random(128 / 8);
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ subject }), key, { iv: iv });
      const subjectEncrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
      const subjectIv = iv.toString();
      const keyHex = key.toString();

      let seals = [];
      for (let i = 0; i < keys.length; i++) {
        const publicKey = keys[i];
        const key = '-----BEGIN PUBLIC KEY-----\n' + publicKey + '\n-----END PUBLIC KEY-----'
        const sealedKey = await RSA.encrypt(keyHex, key);
        seals.push({ publicKey, sealedKey });
      };

      const data = { subjectEncrypted, subjectIv, seals };
      return await addChannel(server, appToken, 'sealed', data, cards);
    },
    removeTopic: async (channelId, topicId) => {
      const { server, appToken } = session.current;
      return await removeChannelTopic(server, appToken, channelId, topicId);
    },
    addReport: async (channelId) => {
      const { server, guid } = session.current;
      return await addFlag(server, guid, channelId);
    },
    addTopicReport: async (channelId, topicId) => {
      const { server, guid } = session.current;
      return await addFlag(server, guid, channelId, topicId);
    },
    setCard: async (channelId, cardId) => {
      const { server, appToken } = session.current;
      return await setChannelCard(server, appToken, channelId, cardId);
    },
    clearCard: async (channelId, cardId) => {
      const { server, appToken } = session.current;
      return await clearChannelCard(server, appToken, channelId, cardId);
    },
    getNotifications: async (channelId) => {
      const { server, appToken } = session.current;
      return await getChannelNotifications(server, appToken, channelId);
    },
    setNotifications: async (channelId, notify) => {
      const { server, appToken } = session.current;
      return await setChannelNotifications(server, appToken, channelId, notify);
    },
    unsealChannelSubject: async (channelId, revision, sealKey) => {
      try {
        const { guid } = session.current;
        const channel = channels.current.get(channelId);
        const { subjectEncrypted, subjectIv, seals } = JSON.parse(channel.detail.data);
        const unsealedKey = await unsealKey(seals, sealKey);
        if (unsealedKey) {
          const iv = CryptoJS.enc.Hex.parse(subjectIv);
          const key = CryptoJS.enc.Hex.parse(unsealedKey);
          const enc = CryptoJS.enc.Base64.parse(subjectEncrypted);
          let cipher = CryptoJS.lib.CipherParams.create({ ciphertext: enc, iv: iv });
          const dec = CryptoJS.AES.decrypt(cipher, key, { iv: iv });
          if (revision === channel.detailRevision) {
            channel.unsealedDetail = JSON.parse(dec.toString(CryptoJS.enc.Utf8));
            await store.actions.setChannelItemUnsealedDetail(guid, channelId, revision, channel.unsealedDetail);
            channels.current.set(channelId, { ...channel });
            updateState({ channels: channels.current });
          }
        }
      }
      catch(err) {
        console.log(err);
      }
    },
    unsealChannelSummary: async (channelId, revision, sealKey) => {
      try {
        const { guid } = session.current;
        const channel = channels.current.get(channelId);
        const { seals } = JSON.parse(channel.detail.data);
        const { messageEncrypted, messageIv } = JSON.parse(channel.summary.lastTopic.data);
        const unsealedKey = await unsealKey(seals, sealKey);
        if (unsealedKey) {
          const iv = CryptoJS.enc.Hex.parse(messageIv);
          const key = CryptoJS.enc.Hex.parse(unsealedKey);
          const enc = CryptoJS.enc.Base64.parse(messageEncrypted);
          let cipher = CryptoJS.lib.CipherParams.create({ ciphertext: enc, iv: iv });
          const dec = CryptoJS.AES.decrypt(cipher, key, { iv: iv });
          if (revision === channel.topicRevision) {
            channel.unsealedSummary = JSON.parse(dec.toString(CryptoJS.enc.Utf8));
            await store.actions.setChannelItemUnsealedSummary(guid, channelId, revision, channel.unsealedSummary);
            channels.current.set(channelId, { ...channel });
            updateState({ channels: channels.current });
          }
        }
      }
      catch(err) {
        console.log(err);
      }
    },
  }

  return { state, actions }
}

