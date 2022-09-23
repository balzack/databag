import { useState, useEffect, useRef, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { CardContext } from 'context/CardContext';
import config from 'constants/Config';

export function useCards() {

  const [state, setState] = useState({
    tabbed: null,
    cards: [],
  });

  const dimensions = useWindowDimensions();
  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (dimensions.width > config.tabbedWidth) {
      updateState({ tabbed: false });
    }
    else {
      updateState({ tabbed: true });
    }
  }, [dimensions]);

  useEffect(() => {
  }, [card]);

  const actions = {
  };

  return { state, actions };
}

