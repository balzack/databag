import { useState, useRef, useEffect, useContext } from 'react';
import { ConversationContext } from 'context/ConversationContext';
import { Image } from 'react-native';
import { useWindowDimensions } from 'react-native';
import SoundPlayer from 'react-native-sound-player'

export function useAudioAsset(topicId, asset) {

  const [state, setState] = useState({
    length: null,
    playing: false,
  });

  const conversation = useContext(ConversationContext);
  const dimensions = useWindowDimensions();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (dimensions.width < dimensions.height) {
      updateState({ length: 0.8 * dimensions.width });
    }
    else {
      updateState({ length: 0.8 * dimensions.height });
    }
  }, [dimensions]);

  useEffect(() => {
    const url = conversation.actions.getTopicAssetUrl(topicId, asset.full); 
    updateState({ url, playing: false });
    return () => { SoundPlayer.stop() }
  }, [topicId, conversation, asset]);

  const actions = {
    play: () => {
      SoundPlayer.playUrl(state.url);
      updateState({ playing: true });
    },
    pause: () => {
      SoundPlayer.stop();
      updateState({ playing: false });
    },
  };

  return { state, actions };
}

