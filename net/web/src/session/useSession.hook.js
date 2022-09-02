import { useContext, useState, useEffect, useRef } from 'react';
import { CardContext } from 'context/CardContext';
import { StoreContext } from 'context/StoreContext';
import { ViewportContext } from 'context/ViewportContext';
import { ProfileContext } from 'context/ProfileContext';
import { ChannelContext } from 'context/ChannelContext';

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

  const card = useContext(CardContext);
  const store = useContext(StoreContext);
  const viewport = useContext(ViewportContext);
  const channel = useContext(ChannelContext);
  const profile = useContext(ProfileContext);
  
  const storeStatus = useRef(null);
  const cardStatus = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (!profile.state.init || !card.state.init || !channel.state.init) {
      updateState({ loading: true });
    }
    else {
      updateState({ loading: false });
    }
  }, [card, channel, profile]);

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  useEffect(() => {
    const contacts = Array.from(card.state.cards.values());
    
    let updated;
    contacts.forEach(contact => {
      if (!updated || updated < contact?.data?.cardDetail?.statusUpdated) {
        updated = contact?.data?.cardDetail?.statusUpdated;
      }
    });

    if (state.cards) {
      cardStatus.current = updated;
      storeStatus.current = updated;
      store.actions.setValue('cards:updated', updated);
    }

    updateState({ cardUpdated: cardStatus.current > storeStatus.current });
    // eslint-disable-next-line
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

