import { useState, useRef } from 'react';
import axios from 'axios';

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
    addTopic: (token, channelId, topicId, files, success, failure) => {
      const controller = new AbortController();
      const entry = {
        index: index.current,
        url: `/content/channels/${channelId}/topics/${topicId}/assets?agent=${token}`,
        files,
        assets: [],
        current: null,
        error: false,
        success,
        failure,
        cancel: controller,
      }
      index.current += 1;
      const key = `:${channelId}`;
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
    addContactTopic: (server, token, cardId, channelId, topicId, files, success, failure) => {
      let host = "";
      if (server) {
        host = `https://${server}`
      }
      const controller = new AbortController();
      const entry = {
        index: index.current,
        url: `${host}/content/channels/${channelId}/topics/${topicId}/assets?contact=${token}`,
        files,
        assets: [],
        current: null,
        error: false,
        success,
        failure,
        cancel: controller,
      }
      index.current += 1;
      const key = `${cardId}:${channelId}`;
      if (!channels.current.has(key)) {
        channels.current.set(key, new Map());
      }
      const topics = channels.current.get(key);
      topics.set(topicId, entry);
      upload(entry, updateProgress, () => { updateComplete(key, topicId) });
    },
    cancelContactTopic: (cardId, channelId, topicId) => {
      abort(`${cardId}:${channelId}`, topicId);
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

async function upload(entry, update, complete) {
  if (!entry.files?.length) {
    entry.success(entry.assets);
    complete();
  }
  else {
    const file = entry.files.shift();
    entry.active = {};
    try {
      if (file.image) {
        const formData = new FormData();
        formData.append('asset', file.image);
        let transform = encodeURIComponent(JSON.stringify(["ithumb;photo", "icopy;photo"]));
        let asset = await axios.post(`${entry.url}&transforms=${transform}`, formData, {
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
            full: asset.data.find(item => item.transform === 'icopy;photo').assetId, 
          }
        });
      }
      else if (file.video) {
        const formData = new FormData();
        formData.append('asset', file.video);
        let thumb = 'vthumb;video;' + file.position;
        let transform = encodeURIComponent(JSON.stringify(["vlq;video", "vhd;video", thumb]));
        let asset = await axios.post(`${entry.url}&transforms=${transform}`, formData, {
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
      else if (file.audio) {
        const formData = new FormData();
        formData.append('asset', file.audio);
        let transform = encodeURIComponent(JSON.stringify(["acopy;audio"]));
        let asset = await axios.post(`${entry.url}&transforms=${transform}`, formData, {
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

