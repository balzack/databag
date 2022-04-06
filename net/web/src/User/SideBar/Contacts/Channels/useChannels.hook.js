import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../../../AppContext/AppContext';
import { useNavigate } from 'react-router-dom';

export function useChannels() {

  const [state, setState] = useState({
    startCards: [],
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const navigate = useNavigate();
  const app = useContext(AppContext);

  const actions = {
    getCardImageUrl: app?.actions?.getCardImageurl,
    getCards: app?.actions?.getConnectedCards,
    setStartCards: (cards) => updateState({ startCards: cards }),
  };

  useEffect(() => {
  }, [app])

  return { state, actions };
}

