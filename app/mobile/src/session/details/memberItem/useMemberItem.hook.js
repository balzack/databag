import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContext } from 'context/CardContext';

export function useMemberItem(item) {

  const [state, setState] = useState({
    name: null,
    handle: null,
    logo: null,
    cardId: null,
  });

  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { cardId, revision, profile } = item;
    const { name, handle, node } = profile;
    updateState({ cardId, name, handle: `${handle}@${node}`,
      logo: profile.imageSet ? card.actions.getCardLogo(cardId, revision) : 'avatar' });
  }, [card]);

  const actions = {
  };

  return { state, actions };
}

