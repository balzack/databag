import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../../../../../AppContext/AppContext';
import { getCardImageUrl } from '../../../../../../Api/getCardImageUrl';

export function useChannelLabel() {

  const [state, setState] = useState({
    guid: null
  });

  const app = useContext(AppContext);

  const actions = {
    getCard: app?.actions?.getCard,
  };

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ guid: app?.state?.Data?.profile?.guid })
  }, [app])

  return { state, actions };
}

