import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';

export function useSelectItem(item, selected, markup) {

  const [state, setState] = useState({
    logo: null,
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
  }, [selected]);

  useEffect(() => {
    updateState({ logo: card.actions.getImageUrl(item.id) });
  }, [card, item]);

  const actions = {
  };

  return { state, actions };
}

