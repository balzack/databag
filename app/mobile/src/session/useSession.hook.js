import { useRef, useState, useEffect, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import config from 'constants/Config';
import { StoreContext } from 'context/StoreContext';
import { CardContext } from 'context/CardContext';
import { RingContext } from 'context/RingContext';

export function useSession() {

  const [state, setState] = useState({
    tabbled: null,
    subWidth: '50%',
    baseWidth: '50%',
    cardId: null,
    converstaionId: null,
    firstRun: null,
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

    let callLogo = null;
    const contact = card.state.cards.get(ring.state.cardId);
    if (contact) {
      const { imageSet } = contact.card?.profile || {};
      callLogo = imageSet ? card.actions.getCardImageUrl(ring.state.cardId) : null;
    }

    const { callStatus, localStream, localVideo, localAudio, remoteStream, remoteVideo, remoteAudio } = ring.state;
    updateState({ ringing, callStatus, callLogo, localStream, localVideo, localAudio, remoteStream, remoteVideo, remoteAudio });
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
    ignore: (call) => {
      ring.actions.ignore(call.cardId, call.callId);
    },
    decline: async (call) => {
      const { cardId, contactNode, contactToken, callId } = call;
      await ring.actions.decline(cardId, contactNode, contactToken, callId);
    },
    accept: async (call) => {
      const { cardId, callId, contactNode, contactToken, calleeToken } = call;
      await ring.actions.accept(cardId, callId, contactNode, contactToken, calleeToken);
    },
    end: async () => {
      await ring.actions.end();
    },
    enableVideo: async () => {
      if (!accessVideo.current) {
        const stream = await mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        accessVideo.current = true;
        accessAudio.current = true;
        updateState({ localStream: stream });
        for (const track of stream.getTracks()) {
          if (track.kind === 'audio') {
            audioTrack.current = track;
          }
          if (track.kind === 'video') {
            videoTrack.current = track;
          }
          pc.current.addTrack(track);
        }
      }
      else {
        videoTrack.current.enabled = true;
      }
      updateState({ localVideo: true, localAudio: true });
    },
    disableVideo: async () => {
      if (videoTrack.current) {
        videoTrack.current.enabled = false;
      }
      updateState({ localVideo: false });
    },
    enableAudio: async () => {
      if (accessAudio.current) {
        audioTrack.current.enabled = true;
        updateState({ localAudio: true });
      }
    },
    disableAudio: async () => {
      if (accessAudio.current) {
        audioTrack.current.enabled = false;
        updateState({ localAudio: false });
      }
    },
  };

  return { state, actions };
}


