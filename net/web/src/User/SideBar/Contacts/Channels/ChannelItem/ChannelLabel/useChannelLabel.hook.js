import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';
import { ChannelContext } from 'context/ChannelContext';
import { ProfileContext } from 'context/ProfileContext';
import { getCardImageUrl } from 'api/getCardImageUrl';

export function useChannelLabel() {

  const [state, setState] = useState({
    guid: null
  });

  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const profile = useContext(ProfileContext);

  const actions = {
    getCardByGuid: card.actions.getCardByGuid,
  };

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (card.state.init && profile.state.init) {
      updateState({ guid: profile.state.profile.guid });
    }
  }, [channel, card, profile])

  return { state, actions };
}

