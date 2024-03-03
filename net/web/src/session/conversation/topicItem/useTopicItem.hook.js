import { useState, useEffect } from 'react';
import { fetchWithTimeout } from 'api/fetchUtil';
import { decryptBlock } from 'context/sealUtil';

export function useTopicItem(topic, contentKey, strings, menuStyle) {

  const [state, setState] = useState({
    editing: false,
    message: null,
    assets: [],
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const base64ToUint8Array = (base64) => {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  useEffect(() => {
    const assets = [];
    if (topic.assets?.length) {
      topic.assets.forEach(asset => {
        if (asset.encrypted) {
          const encrypted = true;
          const { type, thumb, label, extension, parts } = asset.encrypted;
          const getDecryptedBlob = async (abort, progress) => {
            let pos = 0;
            let len = 0;
            
            const slices = []
            for (let i = 0; i < parts.length; i++) {
              if (abort()) {
                throw new Error("asset unseal aborted");
              }
              progress(i, parts.length);
              const part = parts[i];
              const url = topic.assetUrl(part.partId, topic.id);
              const response = await fetchWithTimeout(url, { method: 'GET' });
              const block = await response.text();
              const decrypted = decryptBlock(block, part.blockIv, contentKey);
              const slice = base64ToUint8Array(decrypted);
              slices.push(slice);
              len += slice.byteLength;
            };
            progress(parts.length, parts.length);
            
            const data = new Uint8Array(len)
            for (let i = 0; i < slices.length; i++) {
              const slice = slices[i];
              data.set(slice, pos);
              pos += slice.byteLength
            }
            return new Blob([data]); 
          }
          assets.push({ type, thumb, label, extension, encrypted, getDecryptedBlob });
        }
        else {
          const encrypted = false
          if (asset.image) {
            const type = 'image';
            const thumb = topic.assetUrl(asset.image.thumb, topic.id);
            const full = topic.assetUrl(asset.image.full, topic.id);
            assets.push({ type, thumb, encrypted, full });
          }
          else if (asset.video) {
            const type = 'video';
            const thumb = topic.assetUrl(asset.video.thumb, topic.id);
            const lq = topic.assetUrl(asset.video.lq, topic.id);
            const hd = topic.assetUrl(asset.video.hd, topic.id);
            assets.push({ type, thumb, encrypted, lq, hd });
          }
          else if (asset.audio) {
            const type = 'audio';
            const label = asset.audio.label;
            const full = topic.assetUrl(asset.audio.full, topic.id);
            assets.push({ type, label, encrypted, full });
          }
          else if (asset.binary) {
            const type = 'binary';
            const label = asset.binary.label;
            const extension = asset.binary.extension;
            const data = topic.assetUrl(asset.binary.data, topic.id);
            assets.push({ type, label, extension, encrypted, data });
          }
        }
      });
      updateState({ assets });
    }
    // eslint-disable-next-line
  }, [topic.assets]);

  const actions = {
    setEditing: (message) => {
      updateState({ editing: true, message });
    },
    clearEditing: () => {
      updateState({ editing: false });
    },
    setMessage: (message) => {
      updateState({ message });
    },
  };

  return { state, actions };
}

