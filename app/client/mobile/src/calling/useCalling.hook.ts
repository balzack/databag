import { useState, useContext, useEffect, useRef } from 'react'
import { DisplayContext } from '../context/DisplayContext';
import { AppContext } from '../context/AppContext'
import { ContextType } from '../context/ContextType'
import { Link, type Card } from 'databag-client-sdk';

import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals
} from 'react-native-webrtc';

export function useCalling() {
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const call = useRef(null as { policy: string, peer: RTCPeerConnection, link: Link, candidates: RTCIceCandidate[] } | null);
  const [state, setState] = useState({
    strings: {}, 
    ringing: [],
    calls: [],
    cards: [],
    calling: null as null | Card,
    failed: false,
    loaded: false,
    panelOffset: 0,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const calls = state.ringing
      .map(ring => ({ callId: ring.callId, card: state.cards.find(card => ring.cardId === card.cardId) }) )
      .filter(ring => (ring.card && !ring.card.blocked));
    updateState({ calls });
  }, [state.ringing, state.cards]);

  useEffect(() => {
    const { strings } = display.state;
    updateState({ strings });
  }, [display.state]);

  const constraints = {
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: false,
      VoiceActivityDetection: true
    }     
  };        

  const linkStatus = async (status: string) => {
    if (call.current) {
      const { policy, peer, link } = call.current;
      if (status === 'connected') {
        try {
          const stream = await mediaDevices.getUserMedia({
            audio: true,
            video: {
              frameRate: 30,
              facingMode: 'user'
            }
          });
          for (const track of stream.getTracks()) {
            if (track.kind === 'audio') {
              peer.addTrack(track, stream);
            }
            if (track.kind === 'video') {
              track.enabled = false;
            }
          }
        } catch (err) {
          console.log(err);
          updateState({ failed: true });
        }
      } else if (status === 'closed') {
        try {
          peer.close();
          link.close();
        } catch (err) {
          console.log(err);
        } 
        call.current = null;
        updateState({ calling: null, failed: false });
      }
    }
  }

  const linkMessage = async (message: any) => {
    if (call.current) {
      const { peer, link, candidates, policy } = call.current;
      try {
        if (message.description) {
          if (message.description.type === 'offer' && peer.signalingState !== 'stable') {
            if (policy === 'polite') {
              const rollback = new RTCSessionDescription({ type: 'rollback' });
              await peer.setLocalDescription(rollback);
            } else {
              return;
            }
          }
          const offer = new RTCSessionDescription(message.description);
          await peer.setRemoteDescription(offer);
          if (message.description.type === 'offer') {
            const description = await peer.createAnswer();
            await peer.setLocalDescription(description);
            link.sendMessage({ description });
          }

          for (const candidate of candidates) {
            await peer.addIceCandidate(candidate);
          };
          candidates.length = 0;
        } else if (message.candidate) {
          const candidate = new RTCIceCandidate(message.candidate);
          if (peer.remoteDescription == null) {
            candidates.push(candidate);
          } else {
            await peer.addIceCandidate(candidate);
          }
        }
      } catch (err) {
        console.log(err);
        updateState({ failed: true });
      }
    }
  }

  const peerCandidate = async (candidate) => {
    if (call.current && candidate) {
      const { link } = call.current;
      await link.sendMessage({ candidate });
    }
  }

  const peerNegotiate = async () => {
    if (call.current) {
      const { peer, link } = call.current;
      const description = await peer.createOffer(constraints);
      await peer.setLocalDescription(description);
      await link.sendMessage({ description });
    }
  }

  const transmit = (ice: { urls: string; username: string; credential: string }[]) => {
    const peerConnection = new RTCPeerConnection({ iceServers: ice });
    peerConnection.addEventListener( 'connectionstatechange', event => {
      console.log("CONNECTION STATE", event);
    });
    peerConnection.addEventListener( 'icecandidate', event => {
      peerCandidate(event.candidate);
    });
    peerConnection.addEventListener( 'icecandidateerror', event => {
      console.log("ICE ERROR");
    });
    peerConnection.addEventListener( 'iceconnectionstatechange', event => {
      console.log("ICE STATE CHANGE", event);
    });
    peerConnection.addEventListener( 'negotiationneeded', event => {
      peerNegotiate();
    });
    peerConnection.addEventListener( 'signalingstatechange', event => {
      console.log("ICE SIGNALING", event);
    });
    peerConnection.addEventListener( 'track', event => {
      console.log("TRACK EVENT");
    });
    return peerConnection;
  }

  useEffect(() => {
    if (app.state.session) {
      const setRinging = (ringing: { cardId: string, callId: string }[]) => {
        updateState({ ringing });
      }
      const setContacts = (cards: Card[]) => {
        updateState({ cards });
      }
      const ring = app.state.session.getRing();
      ring.addRingingListener(setRinging);
      const contact = app.state.session.getContact();
      contact.addCardListener(setContacts);
      return () => {
        ring.removeRingingListener(setRinging);
        contact.removeCardListener(setContacts);
      }
    }
  }, [app.state.session]);

  const actions = {
    end: async () => {
      if (!call.current) {
        throw new Error('no active call');
      }
      const { link, peer } = call.current;
      try {
        peer.close();
        link.close();
      } catch (err) {
        console.log(err);
      } 
      call.current = null;
      updateState({ calling: null });
    },
    accept: async (callId: string, call: Call) => {
      if (call.current) {
        throw new Error('active call in progress');
      }
      const { cardId, node } = call;
      const ring = app.state.session.getRing();
      const link = await ring.accept(cardId, callId, node);
      const ice = link.getIce();
      const peer = transmit(ice);
      const policy = 'impolite';
      const candidates = [];
      call.current = { policy, peer, link, candidates }; 
      link.setStatusListener(linkStatus);
      link.setMessageListener(linkMessage);
      updateState({ calling: call.card }); 
    },
    call: async (cardId: string) => {
      if (call.current) {
        throw new Error('active call in proegress');
      }
      const card = state.cards.find(contact => contact.cardId === cardId);
      if (!card) {
        throw new Error('calling contact not found');
      }
      const contact = app.state.session.getContact();
      const link = await contact.callCard(cardId);
      const ice = link.getIce();
      const peer = transmit(ice);
      const policy = 'polite';
      const candidates = [];
      call.current = { policy, peer, link, candidates };
      link.setStatusListener(linkStatus);
      link.setMessageListener(linkMessage);
      updateState({ calling: card });
    },
    loaded: (e) => {
      const { width, height } = e.nativeEvent.layout;
      if (width > (height + 80)) {
        updateState({ panelOffset: 0, loaded: true });
      } else {
        updateState({ panelOffset: ((height - width) - 80) / 2, loaded: true });
      }
    }
  }

  return { state, actions }
}
