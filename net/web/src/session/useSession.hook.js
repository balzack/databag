import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';
import { CardContext } from 'context/CardContext';
import { StoreContext } from 'context/StoreContext';
import { ViewportContext } from 'context/ViewportContext';
import { ProfileContext } from 'context/ProfileContext';

export function useSession() {

  const [state, setState] = useState({
    cardUpdated: false,
    contactGuid: null,
    contactListing: null,
    cardId: null,
    channelId: null,
    conversation: false,
    details: false,
    cards: false,
    listing: false,
    contact: false,
    profile: false,
    account: false,
    loading: false,
  });

  const app = useContext(AppContext);
  const card = useContext(CardContext);
  const store = useContext(StoreContext);
  const viewport = useContext(ViewportContext);
  const profile = useContext(ProfileContext);

  const navigate = useNavigate();
  
  const storeStatus = useRef(null);
  const cardStatus = useRef(0);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (!profile.state.identity?.guid) {
      updateState({ loading: true });
    }
    else {
      updateState({ loading: false });
    }
  }, [profile]);

  useEffect(() => {
    if (!app.state.status) {
      navigate('/');
    }
    // eslint-disable-next-line
  }, [app.state]);

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  useEffect(() => {
    let updated;
    const contacts = Array.from(card.state.cards.values());
    contacts.forEach(contact => {
      if (!updated || updated < contact?.data?.cardDetail?.statusUpdated) {
        updated = contact?.data?.cardDetail?.statusUpdated;
      }
    });
    cardStatus.current = updated;
    updateState({ cardUpdated: cardStatus.current > storeStatus.current });
  }, [card]);

  useEffect(() => {
    storeStatus.current = store.actions.getValue('cards:updated');
    updateState({ cardUpdated: cardStatus.current > storeStatus.current });
  }, [store]);

  const actions = {
    openCards: () => {
      updateState({ cards: true });
    },
    closeCards: () => {
      updateState({ cards: false });
    },
    openListing: () => {
      updateState({ listing: true });
    },
    closeListing: () => {
      updateState({ listing: false });
    },
    openContact: (contactGuid, contactListing) => {
      updateState({ contact: true, contactGuid, contactListing });
    },
    closeContact: () => {
      updateState({ contact: false });
    },
    openProfile: () => {
      updateState({ profile: true });
    },
    closeProfile: () => {
      updateState({ profile: false });
    },
    openAccount: () => {
      updateState({ account: true });
    },
    closeAccount: () => {
      updateState({ account: false });
    },
    openConversation: (channelId, cardId) => {
      updateState({ conversation: true, cardId, channelId });
    },
    closeConversation: () => {
      updateState({ conversation: false });
    },
    openDetails: () => {
      updateState({ details: true });
    },
    closeDetails: () => {
      updateState({ details: false });
    },
  };

  return { state, actions };
}

