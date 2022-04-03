import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../../../AppContext/AppContext';
import { useNavigate } from 'react-router-dom';

export function useCards() {
  
  const [state, setState] = useState({
    cards: [],
  });

  const navigate = useNavigate();
  const app = useContext(AppContext);

  const actions = {
    getCardImageUrl: app?.actions?.getCardImageUrl,
    select: (contact) => {
      navigate(`/user/contact/${contact.data.cardProfile.guid}`);
    }
  };

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (app?.state?.Data?.cards) {
      updateState({ cards: app.state.Data.cards });
    }
    else {
      updateState({ cards: [] });
    }
  }, [app])

  return { state, actions };
}
