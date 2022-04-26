import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';
import { ProfileContext } from 'context/ProfileContext';

export function useChannelLogo() {
  
  const [state, setState] = useState({
    guid: null
  });

  const card = useContext(CardContext);
  const profile = useContext(ProfileContext);

  const actions = {
    getCardImageUrl: card.actions.getImageUrl,
    getCardByGuid: card.actions.getCardByGuid,
  };

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (card.state.init && profile.state.init) {
      updateState({ guid: profile.state.profile.guid })
    }
  }, [card, profile])

  return { state, actions };
}
