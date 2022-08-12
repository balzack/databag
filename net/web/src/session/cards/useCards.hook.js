import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';

export function useCards() {

  const [filter, setFilter] = useState(null);

  const [state, setState] = useState({
    cards: [],
    busy: false }
  );

  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    onFilter: (value) => {
      setFilter(value.toUpperCase());
    },
  };

  useEffect(() => {
  }, [card]);

  return { state, actions };
}
