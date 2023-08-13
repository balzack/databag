import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { Image } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { Platform } from 'react-native';
import RNFetchBlob from "rn-fetch-blob";
import Share from 'react-native-share';

export function useBinaryAsset() {

  const [state, setState] = useState({
    width: 1,
    height: 1,
    downloading: false,
  });

  const dimensions = useWindowDimensions();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { width, height } = dimensions;
    if (width < height) {
      updateState({ width, height: width });
    }
    else {
      updateState({ widht: height, height });
    }
  }, [dimensions]);

  const actions = {
    download: async (label, extension, cached, url) => {
      if (!state.downloading) {
        try {
          updateState({ downloading: true });

          let src;
          if (cached) {
            src = url
          }
          else {
            const blob = await RNFetchBlob.config({ fileCache: true }).fetch("GET", url);
            src = blob.path();
          }

          const path = `${RNFetchBlob.fs.dirs.DocumentDir}`
          const dst = `${path}/${label}.${extension.toLowerCase()}`
          if (RNFetchBlob.fs.exists(dst)) {
            RNFetchBlob.fs.unlink(dst);
          }
          await RNFetchBlob.fs.mv(src, dst);
          try {
            await Share.open({ url: dst, message: `${label}.${extension}`, subject: `${label}.${extension}` })
          }
          catch (err) {
            console.log(err);
          }
          RNFetchBlob.fs.unlink(dst);

          updateState({ downloading: false });
        }
        catch (err) {
          console.log(err);
          updateState({ downloading: false });
          throw new Error('download failed');
        }
      }
    }
  };

  return { state, actions };
}
 
