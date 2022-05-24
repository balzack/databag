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
    updateState({ cards: Array.from(card.state.cards.values()).sort((a, b) => {
      let aName = a.data?.cardProfile?.name?.toLowerCase();
      let bName = b.data?.cardProfile?.name?.toLowerCase();
      if (aName == null && bName == null) {
        return 0;
      }
      if (aName == null && bName != null) {
        return 1;
      }
      if (aName != null && bName == null) {
        return -1;
      }
      if (aName < bName) {
        return -1;
      }
      if (aName > bName) {
        return 1;
      }
      return 0;
    })});
  }, [card])

  return { state, actions };
}
