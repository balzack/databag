import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContext } from 'context/CardContext';

export function useContact(contact) {

  const [state, setState] = useState({
    name: null,
    handle: null,
    node: null,
    location: null,
    description: null,
    logo: null,
    status: null,
  });

  const card = useContext(CardContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    let stateSet = false;
    if (contact?.card) {
      const selected = card.state.cards.get(contact.card);
      if (selected) {
        const { profile, detail, cardId } = selected;
        const { name, handle, node, location, description, imageSet, revision } = profile;
        const logo = imageSet ? card.actions.getCardLogo(cardId, revision) : 'avatar';
        updateState({ name, handle, node, location, description, logo, status: detail.state });
        stateSet = true;
      }
    }
    if (!stateSet && contact?.account) {
      const { handle, name, node, logo, guid } = contact.account;
      const selected = card.actions.getByGuid(guid);
      if (selected) {
        const { cardId, profile, detail } = selected;
        const { name, handle, node, location, description, imageSet, revision } = profile;
        const logo = imageSet ? card.actions.getCardLogo(cardId, revision) : 'avatar';
        updateState({ name, handle, node, location, description, logo, status: detail.state });
        stateSet = true;
      }
      else {
        const { name, handle, node, location, description, logo } = contact.account;
        updateState({ name, handle, node, location, description, logo, status: null });
        stateSet = true;
      }
    }
    if (!stateSet) {
      setState({});
    }
  }, [contact, card]);

  const actions = {
  };

  return { state, actions };
}

