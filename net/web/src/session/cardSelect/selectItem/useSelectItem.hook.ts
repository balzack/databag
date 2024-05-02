import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';

export function useSelectItem(item, selected, markup) {

  const [state, setState] = useState({
    logo: null,
    logoSet: false,
    selected: false,
    busy: false,
    className: 'passive',
    markup: false,
  });

  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (selected) {
      updateState({ className: 'active', selected: selected.has(item.id) });
    }
    else {
      updateState({ className: 'passive', markup: item.id === markup });
    }
    // eslint-disable-next-line
  }, [selected, item]);

  useEffect(() => {
    const contact = card.state.cards.get(item.id);
    if (contact?.data?.cardProfile?.imageSet) {
      updateState({ logoSet: true, logo: card.actions.getCardImageUrl(item.id) });
    }
    else {
      updateState({ logoSet: true, logo: null });
    }
  }, [card, item]);

  const actions = {
  };

  return { state, actions };
}

