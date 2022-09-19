import { useState, useEffect, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ChannelContext } from 'context/ChannelContext';
import config from 'constants/Config';

export function useChannels() {

  const [state, setState] = useState({
    topic: null,
    channels: []
  });

  const channel = useContext(ChannelContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ channels: Array.from(channel.state.channels.values()) });
  }, [channel]);

  const actions = {
    setTopic: (topic) => {
      updateState({ topic });
    },
  };

  return { state, actions };
}

