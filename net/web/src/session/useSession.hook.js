import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';
import { CardContext } from 'context/CardContext';
import { StoreContext } from 'context/StoreContext';
import { SettingsContext } from 'context/SettingsContext';
import { ProfileContext } from 'context/ProfileContext';
import { RingContext } from 'context/RingContext';

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
    ringing: [],
    callStatus: null,
    callLogo: null,
    localStream: null,
    localVideo: false,
    localAudio: false,
    remoteStream: null,
    remoteVideo: false,
    remoteAudio: false,
  });

  const app = useContext(AppContext);
  const card = useContext(CardContext);
  const store = useContext(StoreContext);
  const ring = useContext(RingContext);
  const settings = useContext(SettingsContext);
  const profile = useContext(ProfileContext);

  const navigate = useNavigate();
  
  const storeStatus = useRef(null);
  const cardStatus = useRef(0);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const ringing = [];
    const expired = Date.now(); 
    ring.state.ringing.forEach(call => {
      if (call.expires > expired && !call.status) {
        const { callId, cardId, calleeToken, iceUrl, iceUsername, icePassword } = call;
        const contact = card.state.cards.get(cardId);
        if (contact) {
          const { imageSet, name, handle, node, guid } = contact.data.cardProfile || {};
          const { token } = contact.data.cardDetail;
          const contactToken = `${guid}.${token}`;
          const img = imageSet ? card.actions.getCardImageUrl(cardId) : null;
          ringing.push({ cardId, img, name, handle, contactNode: node, callId, contactToken, calleeToken, iceUrl, iceUsername, icePassword });  
        }
      }
    });

    let callLogo = null;
    const contact = card.state.cards.get(ring.state.cardId);
    if (contact) {
      const { imageSet } = contact.data.cardProfile || {};
      callLogo = imageSet ? card.actions.getCardImageUrl(ring.state.cardId) : null;  
    }

    const { callStatus, localStream, localVideo, localAudio, remoteStream, remoteVideo, remoteAudio } = ring.state;
    updateState({ ringing, callStatus, callLogo, localStream, localVideo, localAudio, remoteStream, remoteVideo, remoteAudio });
    // eslint-disable-next-line
  }, [ring.state]);

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
    const { display, theme } = settings.state;
    updateState({ display, theme });
  }, [settings.state]);

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
      updateState({ conversation: false, cardId: null, channelId: null });
    },
    openDetails: () => {
      updateState({ details: true });
    },
    closeDetails: () => {
      updateState({ details: false });
    },
    ignore: (call) => {
      ring.actions.ignore(call.cardId, call.callId);
    },
    decline: async (call) => {
      const { cardId, contactNode, contactToken, callId } = call;
      const node = contactNode ? contactNode : window.location.host;
      await ring.actions.decline(cardId, node, contactToken, callId);
    },
    accept: async (call) => {
      const { cardId, callId, contactNode, contactToken, calleeToken, iceUrl, iceUsername, icePassword } = call;
      const node = contactNode ? contactNode : window.location.host;
      await ring.actions.accept(cardId, callId, node, contactToken, calleeToken, iceUrl, iceUsername, icePassword);
    },
    end: async () => {
      await ring.actions.end();
    },
    enableVideo: async () => {
      await ring.actions.enableVideo();
    },
    disableVideo: async () => {
      await ring.actions.disableVideo();
    },
    enableAudio: async () => {
      await ring.actions.enableAudio();
    },
    disableAudio: async () => {
      await ring.actions.disableAudio();
    },
  };

  return { state, actions };
}

