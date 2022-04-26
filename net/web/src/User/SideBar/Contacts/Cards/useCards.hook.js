import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';
import { useNavigate } from 'react-router-dom';

export function useCards() {
  
  const [state, setState] = useState({
    cards: [],
  });

  const navigate = useNavigate();
  const card = useContext(CardContext);

  const actions = {
    getImageUrl: card.actions.getImageUrl,
    select: (contact) => {
      navigate(`/user/contact/${contact.data.cardProfile.guid}`);
    }
  };

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ cards: Array.from(card.state.cards.values()) });
  }, [card])

  return { state, actions };
}
