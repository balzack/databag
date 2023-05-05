import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { Image } from 'react-native';
import { useWindowDimensions } from 'react-native';

export function useVideoAsset(asset) {

  const [state, setState] = useState({
    frameWidth: 1,
    frameHeight: 1,
    videoRatio: 1,
    thumbRatio: 1,
    width: 1,
    height: 1,
    thumbWidth: 64,
    thumbHeight: 64,
    url: null,
    playing: false,
    loaded: false,
    controls: false,
    display: { display: 'none' },
  });

  const controls = useRef(null);
  const conversation = useContext(ConversationContext);
  const dimensions = useWindowDimensions();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const frameRatio = state.frameWidth / state.frameHeight;
    if (frameRatio > state.thumbRatio) {
      //thumbHeight constrained
      const thumbHeight = 0.9 * state.frameHeight;
      const thumbWidth = thumbHeight * state.thumbRatio;
      updateState({ thumbWidth, thumbHeight }); 
    }
    else {
      //thumbWidth constrained
      const thumbWidth = 0.9 * state.frameWidth;
      const thumbHeight = thumbWidth / state.thumbRatio;
      updateState({ thumbWidth, thumbHeight });
    }
    if (frameRatio > state.videoRatio) {
      //height constrained
      const height = 0.9 * state.frameHeight;
      const width = height * state.videoRatio;
      updateState({ width, height }); 
    }
    else {
      //width constrained
      const width = 0.9 * state.frameWidth;
      const height = width / state.videoRatio;
      updateState({ width, height });
    }
  }, [state.frameWidth, state.frameHeight, state.videoRatio, state.thumbRatio]);

  useEffect(() => {
    updateState({ frameWidth: dimensions.width, frameHeight: dimensions.height });
  }, [dimensions]);

  useEffect(() => {
    if (asset.encrypted) {
      updateState({ url: asset.decrypted, failed: asset.error });
    }
    else {
      updateState({ url: asset.hd });
    }
  }, [asset]);

  const actions = {
    setRatio: (e) => {
      const { width, height } = e.nativeEvent;
      updateState({ thumbRatio: width / height });
    },
    setResolution: (width, height) => {
      updateState({ display: {}, videoRatio: width / height });
    },
    loaded: () => {
      updateState({ loaded: true });
    },
    play: () => {
      actions.showControls();
      updateState({ playing: true });
    },
    pause: () => {
      updateState({ playing: false });
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

