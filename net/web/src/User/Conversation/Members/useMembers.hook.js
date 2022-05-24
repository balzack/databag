import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { CardContext } from 'context/CardContext';

export function useMembers({ host, members }) {  

  const [state, setState] = useState({
    readonly: false,
    contacts: [],
  });

  const card = useContext(CardContext);

  useEffect(() => {
    let readonly;
    if (host) {
      readonly = true;
    }
    else {
      readonly = false;
    }

    let contacts = [];
    if (readonly) {
      members.forEach((value) => {
        contacts.push({ member: true, card: card.actions.getCardByGuid(value) });
      });
    }
    else {
      card.state.cards.forEach((value, key, map) => {
        contacts.push({ member: members.has(value.data.cardProfile.guid), card: value });
      });
    }
    
    contacts.sort((a, b) => {
      let aName = a.card?.data?.cardProfile?.name?.toLowerCase();
      let bName = b.card?.data?.cardProfile?.name?.toLowerCase();
      if (aName == null && bName == null) {
        return 0;
      }
      if (aName == null && bName != null) {
        return 1;
      }
      if (aName != null && bName == null) {
        return -1;
      }
      if (aName < bName) {
        return -1;
      }
      if (aName > bName) {
        return 1;
      }
      return 0;
    });

    updateState({ readonly, contacts });
  }, [host, members]);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
  };

  return { state, actions };
}
