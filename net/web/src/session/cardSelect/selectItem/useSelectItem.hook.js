import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';

export function useSelectItem(item, selected) {

  const [state, setState] = useState({
    logo: null,
    selected: false,
    busy: false,
  });

  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ selected: selected.has(item.id) });
  }, [selected]);

  useEffect(() => {
    updateState({ logo: card.actions.getImageUrl(item.id) });
  }, [card, item]);

  const actions = {
  };

  return { state, actions };
}

