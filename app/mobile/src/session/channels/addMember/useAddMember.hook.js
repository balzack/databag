import { useState, useEffect, useRef, useContext } from 'react';
import { CardContext } from '../../../context/CardContext';

export function useAddMember(item, members) {

  const [state, setState] = useState({
    name: null,
    handle: null,
    logo: null,
    cardId: null,
    member: false,
  });

  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const member = members.filter(contact => item.cardId === contact);
    updateState({ member: member.length > 0 });
  }, [members]);

  useEffect(() => {
    const { cardId, revision, profile } = item;
    const { name, handle, node } = profile;
    const username = node ? `${handle}/${node}` : handle;
    updateState({ cardId, name, handle: username,
      logo: profile.imageSet ? card.actions.getCardImageUrl(cardId) : 'avatar' });
  }, [card.state]);

  const actions = {
  };

  return { state, actions };
}
