import { useState, useEffect, useContext } from 'react';
import { CardContext } from 'context/CardContext';

export function useCardsIcon(active) {

  const [state, setState] = useState({
    curRevision: null,
    setRevision: null,
  });

  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (active && state.curRevision) {
      card.actions.setRequestRevision(state.curRevision);
    }
  }, [active]);

  useEffect(() => {
    let revision;
    card.state.cards.forEach((contact) => {
      if (contact?.detail?.status === 'pending' || contact?.detail?.status === 'requested') {
        if (!revision || contact.detailRevision > revision) {
          revision = contact.detailRevision;
        }
      }
    });
    if (active && revision !== state.setRevision) {
      card.actions.setRequestRevision(state.curRevision);
    }
    updateState({ setRevision: card.state.requestRevision, curRevision: revision });
    
  }, [card]);

  const actions = {};

  return { state, actions };
}

