import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from '../../../../context/ConversationContext';
import { Image, Platform } from 'react-native';
import { useWindowDimensions } from 'react-native';
import RNFS from "react-native-fs";
import Share from 'react-native-share';

export function useImageAsset(asset) {

  const [state, setState] = useState({
    frameWidth: 1,
    frameHeight: 1,
    imageRatio: 1,
    imageWidth: 1024,
    imageHeight: 1024,
    url: null,
    loaded: false,
    failed: false,
    controls: false,
    downloaded: false,
    showDownloaded: false,
  });

  const conversation = useContext(ConversationContext);
  const dimensions = useWindowDimensions();
  const controls = useRef();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const getExtension = async (path) => {
    const block = await RNFS.read(path, 8, 0, 'base64');
    if (block === '/9j/4AAQSkY=') {
      return 'jpg';
    }
    if (block === 'iVBORw0KGgo=') {
      return 'png';
    }
    if (block === 'R0lGODlhIAM=') {
      return 'gif';
    }
    if (block.startsWith('UklGR')) {
      return 'webp';
    }
    else if (block.startsWith('Qk')) {
      return 'bmp';
    }
    console.log("unknown prefix: ", block);
    return 'dat';
  }

  useEffect(() => {
    if (state.loaded) {
      const frameRatio = state.frameWidth / state.frameHeight;
      if (frameRatio > state.imageRatio) {
        //height constrained
        const height = Math.floor(0.9 * state.frameHeight);
        const width = Math.floor(height * state.imageRatio);

        updateState({ imageWidth: width, imageHeight: height }); 
      }
      else {
        //width constrained
        const width = Math.floor(0.9 * state.frameWidth);
        const height = Math.floor(width / state.imageRatio);
        updateState({ imageWidth: width, imageHeight: height });
      }
    }
    actions.showControls();
  }, [state.frameWidth, state.frameHeight, state.imageRatio, state.loaded]);

  useEffect(() => {
    imageWidth = dimensions.width * 0.9 > state.imageWidth ? state.imageWidth : dimensions.width * 0.9;
    imageHeight = dimensions.height * 0.9 > state.imageHeight ? state.imageHeight : dimensions.height * 0.9;
    updateState({ frameWidth: dimensions.width, frameHeight: dimensions.height, imageWidth, imageHeight });
  }, [dimensions]);

  useEffect(() => {
    if (asset.encrypted) {
      const now = Date.now();
      const url = asset.decrypted ? `file://${asset.decrypted}?now=${now}` : null
      updateState({ url, failed: asset.error });
    }
    else {
      updateState({ url: asset.full, failed: false });
    }
  }, [asset]);

  const actions = {
    setRatio: (e) => {
      const { width, height } = e.nativeEvent;
      updateState({ imageRatio: width / height });
    },
    share: async () => {
      const epoch = Math.ceil(Date.now() / 1000);
      const path = RNFS.TemporaryDirectoryPath + epoch;
      if (await RNFS.exists(path)) {
        await RNFS.unlink(path);
      }
      if (state.url.substring(0, 7) === 'file://') {
        await RNFS.copyFile(state.url.split('?')[0], path);
      }
      else {
        await RNFS.downloadFile({ fromUrl: state.url, toFile: path }).promise;
      }
      const ext = await getExtension(path);
      const fullPath = `${path}.${ext}`
      if (await RNFS.exists(fullPath)) {
        await RNFS.unlink(fullPath);
      }
      await RNFS.moveFile(path, fullPath)
      Share.open({ url: fullPath });
    },
    download: async () => {
      if (!state.downloaded) {
        updateState({ downloaded: true });
        const epoch = Math.ceil(Date.now() / 1000);
        const dir = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath;
        const path = `${dir}/databag_${epoch}`
        if (state.url.substring(0, 7) === 'file://') {
          await RNFS.copyFile(state.url.substring(7).split('?')[0], path);
        }
        else {
          await RNFS.downloadFile({ fromUrl: state.url, toFile: path }).promise;
        }
        const ext = await getExtension(path);
        await RNFS.moveFile(path, `${path}.${ext}`);
        if (Platform.OS !== 'ios') {
          await RNFS.scanFile(`${path}.${ext}`);
        }
        updateState({ showDownloaded: true });
        setTimeout(() => { updateState({ showDownloaded: false }) }, 2000);
      }
    },
    loaded: () => {
      updateState({ loaded: true });
    },
    failed: (e) => {
      updateState({ failed: true });
    },
    showControls: () => {
      clearTimeout(controls.current);
      updateState({ controls: true });
      controls.current = setTimeout(() => {
        updateState({ controls: false });
      }, 2000);
    },
  };

  return { state, actions };
}

