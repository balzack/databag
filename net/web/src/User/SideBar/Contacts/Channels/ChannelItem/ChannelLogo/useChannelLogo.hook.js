import { useContext, useState, useEffect } from 'react';
import { CardContext } from '../../../../../../AppContext/CardContext';
import { ProfileContext } from '../../../../../../AppContext/ProfileContext';

export function useChannelLogo() {
  
  const [state, setState] = useState({
    guid: null
  });

  const card = useContext(CardContext);
  const profile = useContext(ProfileContext);

  const actions = {
    getCardImageUrl: card.actions.getImageUrl,
    getCardByGuid: (guid) => {
      let c = null;
      card.state.cards.forEach((value, key, map) => {
        if(value?.data?.cardProfile?.guid == guid) {
          c = value;
        }
      });
      return c;
    },
  };

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ guid: profile.state.profile.guid })
  }, [profile])

  return { state, actions };
}
