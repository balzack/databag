import { useContext, useState, useEffect } from 'react';
import { CardContext } from 'context/CardContext';
import { ViewportContext } from 'context/ViewportContext';

export function useCards() {

  const [filter, setFilter] = useState(null);

  const [state, setState] = useState({
    display: null,
    cards: [],
    busy: false }
  );

  const card = useContext(CardContext);
  const viewport = useContext(ViewportContext);

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

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  return { state, actions };
}
