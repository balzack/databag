import { useContext, useState, useEffect } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { CardContext } from 'context/CardContext';

export function useChannelItem(item) {

  const [state, setState] = useState({
    contacts: [],
  });

  const profile = useContext(ProfileContext);
  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
  };


  useEffect(() => {
    let contacts = [];
    if (item.guid != null && profile.state.profile.guid != item.guid) {
      contacts.push(card.actions.getCardByGuid(item.guid));
    }
    for (let guid of item.data.channelDetail?.members) {
      if (guid != profile.state.profile.guid) {
        contacts.push(card.actions.getCardByGuid(guid));
      }
    }
    updateState({ contacts });
  }, [profile, item]);

  return { state, actions };
}
