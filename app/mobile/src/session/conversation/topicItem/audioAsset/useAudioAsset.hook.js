import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { Image } from 'react-native';
import { useWindowDimensions, Platform } from 'react-native';
import RNFS from "react-native-fs";
import Share from 'react-native-share';

export function useAudioAsset(asset) {

  const [state, setState] = useState({
    width: 1,
    height: 1,
    url: null,
    playing: false,
    loaded: false,
    downloaded: false,
    showDownloaded: false,
  });

  const closing = useRef(null);
  const conversation = useContext(ConversationContext);
  const dimensions = useWindowDimensions();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const frameRatio = dimensions.width / dimensions.height;
    if (frameRatio > 1) {
      //height constrained
      const height = 0.9 * dimensions.height;
      const width = height;
      updateState({ width, height }); 
    }
    else {
      //width constrained
      const width = 0.9 * dimensions.width;
      const height = width;
      updateState({ width, height });
    }
  }, [dimensions]);

  useEffect(() => {
    if (asset.encrypted) {
      updateState({ url: asset.decrypted, failed: asset.error });
    }
    else {
      updateState({ url: asset.full });
    }
  }, [asset]);

  const actions = {
    share: async () => {
      const epoch = Math.ceil(Date.now() / 1000);
      const path = RNFS.TemporaryDirectoryPath + epoch + '.mp3';
      if (await RNFS.exists(path)) {
        await RNFS.unlink(path);
      }
      if (state.url.substring(0, 7) === 'file://') {
        await RNFS.copyFile(state.url.split('?')[0], path);
      }
      else {
        await RNFS.downloadFile({ fromUrl: state.url, toFile: path }).promise;
      }
      Share.open({ url: path });
    },
    download: async () => {
      if (!state.downloaded) {
        updateState({ downloaded: true }); 
        const epoch = Math.ceil(Date.now() / 1000);
        const dir = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath;
        const path = `${dir}/databag_${epoch}.mp3`
        if (state.url.substring(0, 7) === 'file://') {
          await RNFS.copyFile(state.url.substring(7).split('?')[0], path);
        }
        else {
          await RNFS.downloadFile({ fromUrl: state.url, toFile: path }).promise;
        }
        updateState({ showDownloaded: true });
        setTimeout(() => { updateState({ showDownloaded: false }) }, 2000);
      }
    },
    play: () => {
      updateState({ playing: true });
    },
    pause: () => {
      updateState({ playing: false });
    },
    loaded: () => {
      updateState({ loaded: true });
    }
  };

  return { state, actions };
}

