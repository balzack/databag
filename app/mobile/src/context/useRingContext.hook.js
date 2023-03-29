import { useEffect, useContext, useState, useRef } from 'react';
import { createWebsocket } from 'api/fetchUtil';
import { addContactRing } from 'api/addContactRing';
import { addCall } from 'api/addCall';
import { keepCall } from 'api/keepCall';
import { removeCall } from 'api/removeCall';
import { removeContactCall } from 'api/removeContactCall';

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

export function useRingContext() {
  const [state, setState] = useState({
    ringing: new Map(),
    callStatus: null,
    cardId: null,
    localStream: null,
    localVideo: false,
    localAudio: false,
    remoteStream: null,
    removeVideo: false,
    removeAudio: false,
  });
  const access = useRef(null);

  const EXPIRE = 3000
  const RING = 2000
  const ringing = useRef(new Map());
  const calling = useRef(null);
  const ws = useRef(null);
  const pc = useRef(null);
  const stream = useRef(null);
  const accessVideo = useRef(false);
  const accessAudio = useRef(false);
  const videoTrack = useRef();
  const audioTrack = useRef();
  const candidates = useRef([]);

  const iceServers = [
    {
      urls: 'stun:35.165.123.117:5001?transport=udp', 
      username: 'user', 
      credential: 'pass'
    },
    {
      urls: 'turn:35.165.123.117:5001?transport=udp', 
      username: 'user', 
      credential: 'pass'
    }];

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const actions = {
    setSession: (token) => {
      if (access.current) {
        throw new Error("invalid ring state");
      }
      access.current = token;
      ringing.current = new Map();
      calling.current = null;
      updateState({ callStatus: null, ringing: ringing.current });
    },
    clearSession: () => {
      access.current = null;
    },
    ring: (cardId, callId, calleeToken) => {
      const key = `${cardId}:${callId}`
      const call = ringing.current.get(key) || { cardId, calleeToken, callId }
      call.expires = Date.now() + EXPIRE;
      ringing.current.set(key, call);
      updateState({ ringing: ringing.current });
      setTimeout(() => {
        updateState({ ringing: ringing.current });
      }, EXPIRE);
    },
    ignore: async (cardId, callId) => {
      const key = `${cardId}:${callId}`
      const call = ringing.current.get(key);
      if (call) {
        call.status = 'ignored'
        ringing.current.set(key, call);
        updateState({ ringing: ringing.current });
      }
    },
    decline: async (cardId, contactNode, contactToken, callId) => {
      const key = `${cardId}:${callId}`
      const call = ringing.current.get(key);
      if (call) {
        call.status = 'declined'
        ringing.current.set(key, call);
        updateState({ ringing: ringing.current });
        try {
          await removeContactCall(contactNode, contactToken, callId);
        }
        catch (err) {
          console.log(err);
        }
      }
    },
    accept: async (cardId, callId, contactNode, contactToken, calleeToken) => {
      if (calling.current) {
        throw new Error("active session");
      }

      const key = `${cardId}:${callId}`
      const call = ringing.current.get(key);
      if (call) {
        call.status = 'accepted'
        ringing.current.set(key, call);
        updateState({ ringing: ringing.current });

        // connect signal socket
        candidates.current = [];
        calling.current = { state: "connecting", callId, contactNode, contactToken, host: false };
        updateState({ callStatus: "connecting", cardId, remoteVideo: false, remoteAudio: false });

        pc.current = new RTCPeerConnection({ iceServers });
        pc.current.addEventListener( 'connectionstatechange', event => {
          console.log("CONNECTION STATE", event);
        } );
        pc.current.addEventListener( 'icecandidate', event => {
          ws.current.send(JSON.stringify({ candidate: event.candidate }));
        } );
        pc.current.addEventListener( 'icecandidateerror', event => {
          console.log("ICE ERROR");
        } );
        pc.current.addEventListener( 'iceconnectionstatechange', event => {
          console.log("ICE STATE CHANGE", event);
        } );
        pc.current.addEventListener( 'negotiationneeded', event => {
          console.log("ICE NEGOTIATION", event);
          console.log("ICE NEGOTIATION", event);
          console.log("ICE NEGOTIATION", event);
          console.log("ICE NEGOTIATION", event);
          console.log("ICE NEGOTIATION", event);
          console.log("ICE NEGOTIATION", event);
          console.log("ICE NEGOTIATION", event);
          console.log("ICE NEGOTIATION", event);
          console.log("ICE NEGOTIATION", event);
          console.log("ICE NEGOTIATION", event);
          console.log("ICE NEGOTIATION", event);
          console.log("ICE NEGOTIATION", event);
          console.log("ICE NEGOTIATION", event);
        } );
        pc.current.addEventListener( 'signalingstatechange', event => {
          console.log("ICE SIGNALING", event);
        } );
        pc.current.addEventListener( 'track', event => {

          console.log("ICE TRACK", event.track);
          if (stream.current == null) {
console.log("NEW STREAM.");
console.log("NEW STREAM.");
console.log("NEW STREAM.");
console.log("NEW STREAM.");
console.log("NEW STREAM.");
console.log("NEW STREAM.");
console.log("NEW STREAM.");
console.log("NEW STREAM.");
console.log("NEW STREAM.");
            stream.current = new MediaStream();
            updateState({ remoteStream: stream.current });
          }
          stream.current.addTrack(event.track, stream.current);
        } );




        ws.current = createWebsocket(`wss://${contactNode}/signal`);
        ws.current.onmessage = async (ev) => {
          // handle messages [impolite]
          try {
            const signal = JSON.parse(ev.data);
            if (signal.status === 'closed') {
              ws.current.close();
            }
            else if (signal.description) {
console.log("DESCRIPTION", signal.description);



              stream.current = null;
              if (signal.description.type === 'offer' && pc.current.signalingState !== 'stable') {
console.log("IGNORING OFFER!");
                return; //rudely ignore
              }

              const offer = new RTCSessionDescription(signal.description);
	            await pc.current.setRemoteDescription(offer);

              if (signal.description.type === 'offer') {
                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(answer);
                ws.current.send(JSON.stringify({ description: answer }));
              }

console.log("STATE:", pc.current.signalingState);

              const adding = candidates.current;
              candidates.current = [];
              for (let i = 0; i < adding.length; i++) {
                try {
                  const candidate = new RTCIceCandidate(adding[i]);
                  await pc.current.addIceCandidate(candidate);
                  console.log("success:", adding[i]);
                }
                catch (err) {
                  console.log(err);
                  console.log(adding[i]);
                }
              };
            }
            else if (signal.candidate) {
              if (pc.current.remoteDescription == null) {
                candidates.current.push(signal.candidate);
                return;
              }
              const candidate = new RTCIceCandidate(signal.candidate);
              await pc.current.addIceCandidate(candidate);
            }
          }
          catch (err) {
            console.log(err);
          }
        }
        ws.current.onclose = (e) => {
          // update state to disconnected
          pc.current.close();
          calling.current = null;
          if (videoTrack.current) {
            videoTrack.current.stop();
            videoTrack.current = null;
          }
          if (audioTrack.current) {
            audioTrack.current.stop();
            audioTrack.current = null;
          }
          updateState({ callStatus: null });
        }
        ws.current.onopen = async () => {
          calling.current.state = "connected"
          updateState({ callStatus: "connected" });
          ws.current.send(JSON.stringify({ AppToken: calleeToken }))

          try {
            const constraints = {
              mandatory: {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true,
                VoiceActivityDetection: true
              }
            };
            const offer = await pc.current.createOffer(constraints);
            await pc.current.setLocalDescription(offer);
            ws.current.send(JSON.stringify({ description: offer }));
console.log("OPENING OFFER");
console.log("OPENING OFFER");
console.log("OPENING OFFER");
console.log("OPENING OFFER");
console.log("OPENING OFFER");
console.log("OPENING OFFER");
console.log("OPENING OFFER");
console.log("OPENING OFFER");

          }
          catch(err) {
            console.log(err);
          }
        }
        ws.current.error = (e) => {
          console.log(e)
          ws.current.close();
        }

      }
    },
    end: async () => {
    },
    call: async (cardId, contactNode, contactToken) => {
    },
    enableVideo: async () => {
    },
    disableVideo: async () => {
    },
    enableAudio: async () => {
    },
    disableAudio: async () => {
    },
  }

  return { state, actions }
}

