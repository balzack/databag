import { useRef, useState, useEffect, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import config from 'constants/Config';
import { StoreContext } from 'context/StoreContext';
import { CardContext } from 'context/CardContext';
import { RingContext } from 'context/RingContext';

export function useSession() {

  const [state, setState] = useState({
    ringing: [],
    tabbled: null,
    subWidth: '50%',
    baseWidth: '50%',
    cardId: null,
    converstaionId: null,
    firstRun: null,
  });

  const ring = useContext(RingContext);
  const card = useContext(CardContext);
  const store = useContext(StoreContext);
  const dimensions = useWindowDimensions();
  const navigate = useNavigate();
  const tabbed = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const ringing = [];
    const expired = Date.now();
    ring.state.ringing.forEach(call => {
      if (call.expires > expired && !call.status) {
        const { callId, cardId, calleeToken } = call;
        const contact = card.state.cards.get(cardId);
        if (contact) {
          const { imageSet, name, handle, node, guid } = contact.card?.profile || {};
          const { token } = contact.card?.detail || {};
          const contactToken = `${guid}.${token}`;
          const img = imageSet ? card.actions.getCardImageUrl(cardId) : null;
          ringing.push({ cardId, img, name, handle, contactNode: node, callId, contactToken, calleeToken });
        }
      }
    });

    const { callStatus, localStream, localVideo, localAudio, remoteStream, remoteVideo, remoteAudio } = ring.state;
    updateState({ ringing, callStatus, localStream, localVideo, localAudio, remoteStream, remoteVideo, remoteAudio });
  }, [ring.state]);

  useEffect(() => {
    checkFirstRun();
  }, []);

  const checkFirstRun = async () => {
    const firstRun = await store.actions.getFirstRun();
    updateState({ firstRun });
  }

  useEffect(() => {
    if (tabbed.current !== true) {
      if (dimensions.width > config.tabbedWidth) {
        const width = Math.floor((dimensions.width * 33) / 100);
        tabbed.current = false;
        updateState({ tabbed: false, baseWidth: width + 50, subWidth: width });
      }
      else {
        tabbed.current = true;
        updateState({ tabbed: true });
      }
    }
  }, [dimensions]);

  const actions = {
    setCardId: (cardId) => {
      updateState({ cardId });
    },
    clearFirstRun: () => {
      updateState({ firstRun: false });
      store.actions.setFirstRun();
    },
    ignore: async (cardId, callId) => {
      await ring.actions.ignore(cardId, callId);
    },
    decline: async (cardId, contactNode, contactToken, callId) => {
      await ring.actions.decline(cardId, contactNode, contactToken, callId);
    },
    accept: async (cardId, callId, contactNode, contactToken, calleeToken) => {
      await ring.actions.accept(cardId, callId, contactNode, contactToken, calleeToken);
    },

  };

  return { state, actions };
}


