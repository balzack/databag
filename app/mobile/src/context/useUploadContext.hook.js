import { useState, useRef } from 'react';
import axios from 'axios';
import { createThumbnail } from "react-native-create-thumbnail";
import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';

const ENCRYPTED_BLOCK_SIZE = (1024 * 1024);

export function useUploadContext() {

  const [state, setState] = useState({
    progress: new Map(),
  });
  const channels = useRef(new Map());
  const index = useRef(0);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  };

  const updateComplete = (channel, topic) => {
    let topics = channels.current.get(channel);
    if (topics) {
      topics.delete(topic);
    }
    updateProgress();
  }

  const updateProgress = () => {
    let progress = new Map();
    channels.current.forEach((topics, channel) => {
      let assets = [];
      topics.forEach((entry, topic, map) => {
        let active = entry.active ? 1 : 0;
        assets.push({
          upload: entry.index,
          topicId: topic,
          active: entry.active,
          uploaded: entry.assets.length,
          index: entry.assets.length + active,
          count: entry.assets.length + entry.files.length + active,
          error: entry.error,
        });
      });
      if (assets.length) {
        progress.set(channel, assets.sort((a, b) => (a.upload < b.upload) ? 1 : -1));
      }
    });
    updateState({ progress });
  }

  const abort = (channelId, topicId) => {
    const channel = channels.current.get(channelId);
    if (channel) {
      const topic = channel.get(topicId);
      if (topic) {
        topic.cancel.abort();
        channel.delete(topicId);
        updateProgress();
      }
    }
  }

  const actions = {
    addTopic: (node, token, channelId, topicId, files, success, failure, cardId) => {
      const url = cardId ?
          `https://${node}/content/channels/${channelId}/topics/${topicId}/assets?contact=${token}` : 
          `https://${node}/content/channels/${channelId}/topics/${topicId}/assets?agent=${token}`;
      const key = cardId ? `${cardId}:${channelId}` : `:${channelId}`; 
      const controller = new AbortController();
      const entry = {
        index: index.current,
        url: url,
        files,
        assets: [],
        current: null,
        error: false,
        success,
        failure,
        cancel: controller,
      }
      index.current += 1;
      if (!channels.current.has(key)) {
        channels.current.set(key, new Map());
      }
      const topics = channels.current.get(key);
      topics.set(topicId, entry);

      upload(entry, updateProgress, () => { updateComplete(key, topicId) } );
    },
    cancelTopic: (channelId, topicId) => {
      abort(`:${channelId}`, topicId);
    },
    cancelContactTopic: (cardId, channelId, topicId) => {
      abort(`${cardId}:${channelId}`, topicId);
    },
    clearErrors: (cardId, channelId) => {
      const key = cardId ? `${cardId}:${channelId}` : `:${channelId}`;
      const topics = channels.current.get(key);
      if (topics) {
        topics.forEach((topic, topicId) => {
          if (topic.error) {
            topic.cancel.abort();
            topics.delete(topicId);
            updateProgress();
          }
        });
      }
    },
    clear: () => {
      channels.current.forEach((topics, channelId) => {
        topics.forEach((assets, topicId) => {
          assets.cancel.abort();
        });
      });
      channels.current.clear();
      updateProgress();
    }
  }

  return { state, actions }
}

async function getThumb(file, type, position) {
  if (type === 'image') {
    const thumb = await ImageResizer.createResizedImage(file, 192, 192, "JPEG", 50, 0, null);
    const base = await RNFS.readFile(thumb.path, 'base64')
    return `data:image/jpeg;base64,${base}`;
  }
  else if (type === 'video') {
    const shot = await createThumbnail({ url: url, timeStamp: position * 1000 })
    const thumb = await ImageResizer.createResizedImage('file://' + shot.path, 192, 192, "JPEG", 50, 0, null);
    const base = await RNFS.readFile(thumb.path, 'base64')
    return `data:image/jpeg;base64,${base}`;
  }
  else {
    return null
  }
}

async function upload(entry, update, complete) {
  if (!entry.files?.length) {
    try {
      await entry.success(entry.assets);
      complete();
    }
    catch (err) {
      console.log(err);
      entry.failure();
      entry.error = true;
      update();
    }
  }
  else {
    const file = entry.files.shift();
    entry.active = {};
    try {
      if (file.encrypted) {
        const { data, type, size, getEncryptedBlock, position } = file;
        const thumb = await getThumb(data, type, position);
        const parts = [];
        for (let pos = 0; pos < size; pos += ENCRYPTED_BLOCK_SIZE) {
          const len = pos + ENCRYPTED_BLOCK_SIZE > size ? size - pos : ENCRYPTED_BLOCK_SIZE;
          const { blockEncrypted, blockIv } = await getEncryptedBlock(pos, len);
          const part = await axios.post(`${entry.baseUrl}blocks${entry.urlParams}`, blockEncrypted, {
            headers: {'Content-Type': 'text/plain'},
            signal: entry.cancel.signal,
            onUploadProgress: (ev) => {
              const { loaded, total } = ev;
              const partLoaded = pos + Math.floor(len * loaded / total);
              entry.active = { loaded: partLoaded, total: size }
              update();
            }
          });
          parts.push({ blockIv, partId: part.data.assetId });
        }
        entry.assets.push({
          encrypted: { type, thumb, parts }
        });
      }
      else if (file.type === 'image') {
        const formData = new FormData();
        if (file.data.startsWith('file:')) {
          formData.append("asset", {uri: file.data, name: 'asset', type: 'application/octent-stream'});
        }
        else {
          formData.append("asset", {uri: 'file://' + file.data, name: 'asset', type: 'application/octent-stream'});
        }
        let transform = encodeURIComponent(JSON.stringify(["ithumb;photo", "ilg;photo"]));
        let asset = await axios.post(`${entry.url}&transforms=${transform}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          signal: entry.cancel.signal,
          onUploadProgress: (ev) => {
            const { loaded, total } = ev;
            entry.active = { loaded, total }
            update();
          },
        });
        entry.assets.push({
          image: {
            thumb: asset.data.find(item => item.transform === 'ithumb;photo').assetId,
            full: asset.data.find(item => item.transform === 'ilg;photo').assetId, 
          }
        });
      }
      else if (file.type === 'video') {
        const formData = new FormData();
        if (file.data.startsWith('file:')) {
          formData.append("asset", {uri: file.data, name: 'asset', type: 'application/octent-stream'});
        }
        else {
          formData.append("asset", {uri: 'file://' + file.data, name: 'asset', type: 'application/octent-stream'});
        }
        let thumb = 'vthumb;video;' + file.position;
        let transform = encodeURIComponent(JSON.stringify(["vlq;video", "vhd;video", thumb]));
        let asset = await axios.post(`${entry.url}&transforms=${transform}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          signal: entry.cancel.signal,
          onUploadProgress: (ev) => {
            const { loaded, total } = ev;
            entry.active = { loaded, total }
            update();
          },
        });
        entry.assets.push({
          video: {
            thumb: asset.data.find(item => item.transform === thumb).assetId,
            lq: asset.data.find(item => item.transform === 'vlq;video').assetId,
            hd: asset.data.find(item => item.transform === 'vhd;video').assetId,
          }
        });
      }
      else if (file.type === 'audio') {
        const formData = new FormData();
        if (file.data.startsWith('file:')) {
          formData.append("asset", {uri: file.data, name: 'asset', type: 'application/octent-stream'});
        }
        else {
          formData.append("asset", {uri: 'file://' + file.data, name: 'asset', type: 'application/octent-stream'});
        }
        let transform = encodeURIComponent(JSON.stringify(["acopy;audio"]));
        let asset = await axios.post(`${entry.url}&transforms=${transform}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          signal: entry.cancel.signal,
          onUploadProgress: (ev) => {
            const { loaded, total } = ev;
            entry.active = { loaded, total }
            update();
          },
        });
        entry.assets.push({
          audio: {
            label: file.label,
            full: asset.data.find(item => item.transform === 'acopy;audio').assetId,
          }
        });
      }
      entry.active = null;
      upload(entry, update, complete);
    }
    catch (err) {
      console.log(err);
      entry.failure();
      entry.error = true;
      update();
    }
  }
}

