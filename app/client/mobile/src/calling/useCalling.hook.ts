import { useState, useContext, useEffect, useRef } from 'react'
import { DisplayContext } from '../context/DisplayContext';
import { AppContext } from '../context/AppContext'
import { ContextType } from '../context/ContextType'
import { Link } from 'databag-client-sdk';

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
  const call = useRef(null as { peerConnection: RTCPeerConnection, signalLink: Link } | null);
  const [state, setState] = useState({
    strings: {}, 
    ringing: [],
    calls: [],
    cards: [],
    calling: false,
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
    call: async (cardId: string) => {
      if (call.current) {
        throw new Error('active call in proegress');
      }

      const contact = app.state.session.getContact();
      const link = await contact.callCard(cardId);
      const ice = link.getIce();

      const peerConnection = new RTCPeerConnection({ iceServers: ice });
      peerConnection.addEventListener( 'connectionstatechange', event => {
        console.log("CONNECTION STATE", event);
      } );
      peerConnection.addEventListener( 'icecandidate', event => {
        console.log("ICE CANDIDATE", event);
      } );
      peerConnection.addEventListener( 'icecandidateerror', event => {
        console.log("ICE ERROR");
      } );
      peerConnection.addEventListener( 'iceconnectionstatechange', event => {
        console.log("ICE STATE CHANGE", event);
      } );
      peerConnection.addEventListener( 'negotiationneeded', async (ev) => {
        console.log("ICE NEGOTIATION NEEDEED");
      } );
      peerConnection.addEventListener( 'signalingstatechange', event => {
        console.log("ICE SIGNALING", event);
      } );
      peerConnection.addEventListener( 'track', event => {
        console.log("TRACK EVENT");
      } );

      link.setStatusListener(async (status: string) => {
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
                peerConnection.addTrack(track, stream);
              }
              if (track.kind === 'video') {
                track.enabled = false;
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
      });
      link.setMessageListener(async (message: any) => {
        // relay ice config
      });
      console.log(link);
    },
  }

  return { state, actions }
}
