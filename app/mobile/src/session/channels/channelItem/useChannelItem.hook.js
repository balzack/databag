import { useState, useEffect, useRef, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';

export function useChannelItem(item) {

  const [state, setState] = useState({});

  const channel = useContext(ChannelContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setRead: () => {
      channel.actions.setReadRevision(item.channelId, item.revision);
    },
  };

  return { state, actions };
}

