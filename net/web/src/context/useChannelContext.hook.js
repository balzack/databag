import { useState, useRef, useContext } from 'react';
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
import { UploadContext } from 'context/UploadContext';
import CryptoJS from 'crypto-js';
import { JSEncrypt } from 'jsencrypt'

export function useChannelContext() {
  const [state, setState] = useState({
    init: false,
    channels: new Map(),
  });
  const upload = useContext(UploadContext);
  const access = useRef(null);
  const revision = useRef(null);
  const channels = useRef(new Map());
  const next = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const updateChannels = async () => {
    let delta = await getChannels(access.current, revision.current);
    for (let channel of delta) {
      if (channel.data) {
        let cur = channels.current.get(channel.id);
        if (cur == null) {
          cur = { id: channel.id, data: { } }
        }
        if (cur.data.detailRevision !== channel.data.detailRevision) {
          if (channel.data.channelDetail != null) {
            cur.data.channelDetail = channel.data.channelDetail;
            cur.data.unsealedSubject = null;
          }
          else {
            let detail = await getChannelDetail(access.current, channel.id);
            cur.data.channelDetail = detail;
            cur.data.unsealedChannel = null;
          }
          cur.data.detailRevision = channel.data.detailRevision;
        }
        if (cur.data.topicRevision !== channel.data.topicRevision) {
          if (channel.data.channelSummary != null) {
            cur.data.channelSummary = channel.data.channelSummary;
          }
          else {
            let summary = await getChannelSummary(access.current, channel.id);
            cur.data.channelSummary = summary;
          }
          cur.data.topicRevision = channel.data.topicRevision;
        }
        cur.revision = channel.revision;
        channels.current.set(channel.id, { ...cur });
      }
      else {
        channels.current.delete(channel.id);
      }
    }
  }

  const setChannels = async (rev) => {
    let force = false;
    if (rev == null) {
      force = true;
      rev = revision.current;
    }
    if (next.current == null) {
      next.current = rev;
      if (force || revision.current !== rev) {
        await updateChannels();
        updateState({ init: true, channels: channels.current });
        revision.current = rev;
      }
      let r = next.current;
      next.current = null;
      if (revision.current !== r) {
        setChannels(r);
      }
    }
    else {
      next.current = rev;
    }
  }

  const actions = {
    setToken: (token) => {
      access.current = token;
    },
    clearToken: () => {
      access.current = null;
      channels.current = new Map();
      revision.current = null;
      setState({ init: false, channels: new Map() });
    },
    setRevision: async (rev) => {
      setChannels(rev);
    },
    addBasicChannel: async (cards, subject) => {
      return await addChannel(access.current, 'superbasic', cards, { subject });
    },
    addSealedChannel: async (cards, subject, keys) => {
      const key = CryptoJS.lib.WordArray.random(256 / 8);
      const iv = CryptoJS.lib.WordArray.random(128 / 8);
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ subject }), key, { iv: iv });
      const subjectEncrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
      const subjectIv = iv.toString();
      const keyHex = key.toString();

      let seals = [];
      let crypto = new JSEncrypt();
      keys.forEach(publicKey => {
        crypto.setPublicKey(publicKey);
        const sealedKey = crypto.encrypt(keyHex);
        seals.push({ publicKey, sealedKey });
      });

      const data = { subjectEncrypted, subjectIv, seals };
      return await addChannel(access.current, 'sealed', cards, data);
    },
    unsealChannelSubject: (channelId, sealKey) => {
      const channel = channels.current.get(channelId);

      const { subjectEncrypted, subjectIv, seals } = JSON.parse(channel.data.channelDetail.data);
      if (seals?.length) {
        seals.forEach(seal => {
          if (seal.publicKey === sealKey.public) {
            let crypto = new JSEncrypt();
            crypto.setPrivateKey(sealKey.private);
            const unsealedKey = crypto.decrypt(seal.sealedKey);
            const iv = CryptoJS.enc.Hex.parse(subjectIv);
            const key = CryptoJS.enc.Hex.parse(unsealedKey);
            const enc = CryptoJS.enc.Base64.parse(subjectEncrypted);
            let cipher = CryptoJS.lib.CipherParams.create({ ciphertext: enc, iv: iv });
            const dec = CryptoJS.AES.decrypt(cipher, key, { iv: iv });
            channel.data.unsealedChannel = JSON.parse(dec.toString(CryptoJS.enc.Utf8));
            channels.current.set(channel.id, { ...channel });
            updateState({ channels: channels.current });
          }
        });
      }
    },
    setChannelSubject: async (channelId, subject) => {
      return await setChannelSubject(access.current, channelId, 'superbasic', { subject });
    },
    setChannelSealedSubject: async (channelId, subject, sealKey) => {
      const channel = channels.current.get(channelId);

      let { seals, subjectEncrypted, subjectIv } = JSON.parse(channel.data.channelDetail.data);
      if (seals?.length) {
        seals.forEach(seal => {
          if (seal.publicKey === sealKey.public) {
            let crypto = new JSEncrypt();
            crypto.setPrivateKey(sealKey.private);
            const unsealedKey = crypto.decrypt(seal.sealedKey);
            const key = CryptoJS.enc.Hex.parse(unsealedKey);

            const iv = CryptoJS.lib.WordArray.random(128 / 8);
            const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ subject }), key, { iv: iv });
            subjectEncrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
            subjectIv = iv.toString();
          }
        });
      }
      const data = { subjectEncrypted, subjectIv, seals };
      return await setChannelSubject(access.current, channelId, 'sealed', data);
    },
    setChannelCard: async (channelId, cardId) => {
      return await setChannelCard(access.current, channelId, cardId);
    },
    clearChannelCard: async (channelId, cardId) => {
      return await clearChannelCard(access.current, channelId, cardId);
    },
    removeChannel: async (channelId) => {
      return await removeChannel(access.current, channelId);
    },
    removeChannelTopic: async (channelId, topicId) => {
      await removeChannelTopic(access.current, channelId, topicId);
      try {
        await setChannels(null);
      }
      catch (err) {
        console.log(err);
      }
    },
    setChannelTopicSubject: async (channelId, topicId, data) => {
      await setChannelTopicSubject(access.current, channelId, topicId, 'superbasictopic', data);
      try {
        await setChannels(null);
      }
      catch (err) {
        console.log(err);
      }
    },
    setSealedChannelTopicSubject: async (channelId, topicId, data, sealKey) => {
      const iv = CryptoJS.lib.WordArray.random(128 / 8);
      const key = CryptoJS.enc.Hex.parse(sealKey);
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ message: data }), key, { iv: iv });
      const messageEncrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
      const messageIv = iv.toString();
      await setChannelTopicSubject(access.current, channelId, topicId, 'sealedtopic', { messageEncrypted, messageIv });
      try {
        await setChannels(null);
      }
      catch (err) {
        console.log(err);
      }
    },
    addChannelTopic: async (channelId, message, files) => {
      if (files?.length) {
        const topicId = await addChannelTopic(access.current, channelId, null, null, null);
        upload.actions.addTopic(access.current, channelId, topicId, files, async (assets) => {
          message.assets = assets;
          await setChannelTopicSubject(access.current, channelId, topicId, message);
        }, async () => {
          try {
            await removeChannelTopic(access.current, channelId, topicId);
          }
          catch(err) {
            console.log(err);
          }
        });
      }
      else {
        await addChannelTopic(access.current, channelId, 'superbasictopic', message, files);
      }
      try {
        await setChannels(null);
      }
      catch (err) {
        console.log(err);
      }
    },
    addSealedChannelTopic: async (channelId, sealKey, message) => {
      const iv = CryptoJS.lib.WordArray.random(128 / 8);
      const key = CryptoJS.enc.Hex.parse(sealKey);
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ message }), key, { iv: iv });
      const messageEncrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
      const messageIv = iv.toString();
      await addChannelTopic(access.current, channelId, 'sealedtopic', { messageEncrypted, messageIv });
    },
    getChannel: (channelId) => {
      return channels.current.get(channelId);
    },
    getChannelRevision: (channelId) => {
      let channel = channels.current.get(channelId);
      return channel?.revision;
    },
    getChannelTopics: async (channelId, revision, count, begin, end) => {
      return await getChannelTopics(access.current, channelId, revision, count, begin, end);
    },
    getChannelTopic: async (channelId, topicId) => {
      return await getChannelTopic(access.current, channelId, topicId);
    },
    getChannelTopicAssetUrl: (channelId, topicId, assetId) => {
      return getChannelTopicAssetUrl(access.current, channelId, topicId, assetId);
    }
  }

  return { state, actions }
}


