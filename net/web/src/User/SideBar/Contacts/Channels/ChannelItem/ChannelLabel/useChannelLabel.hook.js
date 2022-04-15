import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../../../../../AppContext/AppContext';
import { getCardImageUrl } from '../../../../../../Api/getCardImageUrl';

export function useChannelLabel() {

  const [state, setState] = useState({
    guid: null
  });

  const app = useContext(AppContext);

  const actions = {
    getCardByGuid: app?.actions?.getCardByGuid,
  };

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ guid: app?.state?.Data?.profile?.guid })
  }, [app])

  return { state, actions };
}

