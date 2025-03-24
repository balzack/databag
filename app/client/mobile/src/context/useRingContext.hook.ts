import { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { ContextType } from '../context/ContextType';
import { Link, type Card } from 'databag-client-sdk';
import InCallManager from 'react-native-incall-manager';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
  mediaDevices,
} from 'react-native-webrtc';

const CLOSE_POLL_MS = 100;

export function useRingContext() {
  const app = useContext(AppContext) as ContextType;
  const call = useRef(null as { peer: RTCPeerConnection, link: Link, candidates: RTCIceCandidate[] } | null);
  const sourceStream = useRef(null as null|MediaStream);
  const localStream = useRef(null as null|MediaStream);
  const localAudio = useRef(null as null|MediaStreamTrack);
  const localVideo = useRef(null as null|MediaStreamTrack);
  const localAudioAdded = useRef(false);
  const localVideoAdded = useRef(false);
  const remoteStream = useRef(null as null|MediaStream);
  const updatingPeer = useRef(false);
  const peerUpdate = useRef([] as {type: string, data?: any}[]);
  const connecting = useRef(false);
  const passive = useRef(false);
  const passiveTracks = useRef([] as MediaStreamTrack[]);
  const closing = useRef(false);
  const [ringing, setRinging] = useState([] as { cardId: string, callId: string }[]);
  const [cards, setCards] = useState([] as Card[]);

  const [state, setState] = useState({
    calls: [] as { callId: string, cardId: string}[],
    calling: null as null | Card,
    localStream: null as null|MediaStream,
    remoteStream: null as null|MediaStream,
    localVideo: false,
    remoteVideo: false,
    audioEnabled: false,
    videoEnabled: false,
    connected: false,
    connectedTime: 0,
    failed: false,
    fullscreen: false,
  });


  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }));
  };

  useEffect(() => {
    const calls = ringing.map(ring => ({ callId: ring.callId, card: cards.find(card => ring.cardId === card.cardId) }))
      .filter(ring => (ring.card && !ring.card.blocked));
    updateState({ calls });
  }, [ringing, cards]);

  const linkStatus = async (status: string) => {
    if (call.current) {
      try {
        if (status === 'connected') {
          const now = new Date();
          const connectedTime = Math.floor(now.getTime() / 1000);
          updateState({ connected: true, connectedTime });
          await actions.enableAudio();
        } else if (status === 'closed') {
          await cleanup();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const updatePeer = async (mode: string, value?: any) => {
    peerUpdate.current.push({ type: mode, data: value });

    if (!updatingPeer.current) {
      updatingPeer.current = true;
      while (!closing.current && call.current && peerUpdate.current.length > 0) {
        const { peer, link, candidates } = call.current;
        const { type, data } = peerUpdate.current.shift() || { type: '' };
        try {
          switch (type) {
            case 'negotiate':
              const description = await peer.createOffer();
              await peer.setLocalDescription(description);
              await link.sendMessage({ description });
              break;
            case 'candidate':
              await link.sendMessage({ data });
              break;
            case 'message':
              if (data.description) {
                const offer = new RTCSessionDescription(data.description);
                await peer.setRemoteDescription(offer);
                if (data.description.type === 'offer') {
                  const desc = await peer.createAnswer();
                  await peer.setLocalDescription(desc);
                  link.sendMessage({ description: desc });
                }
                for (const candidate of candidates) {
                  await peer.addIceCandidate(candidate);
                }
                call.current.candidates = [];
              } else if (data.candidate) {
                const candidate = new RTCIceCandidate(data.candidate);
                if (peer.remoteDescription == null) {
                  candidates.push(candidate);
                } else {
                  await peer.addIceCandidate(candidate);
                }
              }
              break;
            case 'remote_track':
              if (remoteStream.current) {
                remoteStream.current.addTrack(data);
                passive.current = false;
                passiveTracks.current.forEach(track => {
                  peer.addTrack(track, sourceStream.current);
                });
                passiveTracks.current = [];
                if (data.kind === 'video') {
                  InCallManager.setForceSpeakerphoneOn(true);
                  updateState({ remoteVideo: true });
                }
              }
              break;
            case 'local_track':
              if (passive.current) {
                passiveTracks.current.push(data);
              } else {
                peer.addTrack(data, sourceStream.current);
              }
              if (data.kind === 'video') {
                InCallManager.setForceSpeakerphoneOn(true);
                updateState({ localVideo: true });
              }
              break;
            default:
              console.log('unknown event');
              break;
          }
        } catch (err) {
          console.log(err);
          updateState({ failed: true });
        }
      }
      updatingPeer.current = false;
    }
  };

  const setup = async (link: Link, card: Card, polite: boolean) => {

    passive.current = polite;
    passiveTracks.current = [];
    remoteStream.current = new MediaStream();
    localStream.current = new MediaStream();
    sourceStream.current = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        frameRate: 30,
        facingMode: 'user',
      },
    });
    InCallManager.start({media: 'audio'});
    localAudio.current = sourceStream.current.getTracks().find(track => track.kind === 'audio');
    localVideo.current = sourceStream.current.getTracks().find(track => track.kind === 'video');
    if (localAudio.current) {
      localAudio.current.enabled = false;
    }
    if (localVideo.current) {
      localVideo.current.enabled = false;
    }

    const ice = link.getIce();
    const peer = transmit(ice);
    const candidates = [] as RTCIceCandidate[];
    call.current = { peer, link, candidates };
    updateState({ calling: card, failed: false, connected: false, connectedTime: 0,
      audioEnabled: false, videoEnabled: false, localVideo: false, remoteVideo: false,
      localStream: localStream.current, remoteStream: remoteStream.current });
    link.setStatusListener(linkStatus);
    link.setMessageListener((msg: any) => updatePeer('message', msg));
  };

  const cleanup = async () => {
    closing.current = true;
    while (updatingPeer.current || connecting.current) {
      await new Promise((r) => setTimeout(r, CLOSE_POLL_MS));
    }
    if (call.current) {
      const { peer, link } = call.current;
      peer.close();
      link.close();
      call.current = null;
    }
    if (localVideo.current) {
      localVideo.current.stop();
      localVideo.current = null;
      localVideoAdded.current = false;
    }
    if (localAudio.current) {
      localAudio.current.stop();
      localAudio.current = null;
      localAudioAdded.current = false;
    }
    localStream.current = null;
    remoteStream.current = null;
    sourceStream.current = null;
    peerUpdate.current = [];
    InCallManager.stop();
    updateState({ calling: null, connected: false, connectedTime: 0, fullscreen: false, failed: false,
      localStream: null, remoteStream: null, localVideo: false, remoteVideo: false });
    closing.current = false;
  };

  const transmit = (ice: { urls: string; username: string; credential: string }[]) => {
    const peerConnection = new RTCPeerConnection({ iceServers: ice });
    peerConnection.addEventListener( 'connectionstatechange', () => {
      if (peerConnection.connectionState === 'failed') {
        cleanup();
      }
    });
    peerConnection.addEventListener( 'icecandidate', event => {
      updatePeer('candidate', event.candidate);
    });
    peerConnection.addEventListener( 'icecandidateerror', event => {
      console.log('ICE ERROR', event);
    });
    peerConnection.addEventListener( 'iceconnectionstatechange', event => {
      console.log('ICE STATE CHANGE', event);
    });
    peerConnection.addEventListener( 'negotiationneeded', () => {
      updatePeer('negotiate');
    });
    peerConnection.addEventListener( 'signalingstatechange', event => {
      console.log('ICE SIGNALING', event);
    });
    peerConnection.addEventListener( 'track', event => {
      updatePeer('remote_track', event.track);
    });
    return peerConnection;
  };

  useEffect(() => {
    if (app.state.session) {
      const setRing = (incoming: { cardId: string, callId: string }[]) => {
        setRinging(incoming);
      };
      const setContacts = (contacts: Card[]) => {
        setCards(contacts);
      };
      const ring = app.state.session.getRing();
      ring.addRingingListener(setRinging);
      const contact = app.state.session.getContact();
      contact.addCardListener(setContacts);
      return () => {
        ring.removeRingingListener(setRing);
        contact.removeCardListener(setContacts);
        cleanup();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.state.session]);

  const actions = {
    setFullscreen: (fullscreen: boolean) => {
      updateState({ fullscreen });
    },
    ignore: async (callId: string, card: Card) => {
      const ring = app.state.session.getRing();
      await ring.ignore(card.cardId, callId);
    },
    decline: async (callId: string, card: Card) => {
      const ring = app.state.session.getRing();
      await ring.decline(card.cardId, callId);
    },
    end: async () => {
      await cleanup();
    },
    accept: async (callId: string, card: Card) => {
      if (connecting.current || closing.current || call.current) {
        throw new Error('not ready to accept calls');
      }
      try {
        connecting.current = true;
        const { cardId, node } = card;
        const ring = app.state.session.getRing();
        const link = await ring.accept(cardId, callId, node);
        await setup(link, card, true);
        connecting.current = false;
      } catch (err) {
        connecting.current = false;
        throw err;
      }
    },
    call: async (card: Card) => {
      if (connecting.current || closing.current || call.current) {
        throw new Error('not ready make calls');
      }
      try {
        connecting.current = true;
        const contact = app.state.session.getContact();
        const link = await contact.callCard(card.cardId);
        await setup(link, card, false);
        connecting.current = false;
      } catch (err) {
        connecting.current = false;
        throw err;
      }
    },
    enableAudio: async () => {
      if (closing.current || !call.current) {
        throw new Error('cannot unmute audio');
      }
      if (!localAudio.current) {
        throw new Error('audio not available');
      } else {
        if (!localAudioAdded.current) {
          localAudioAdded.current = true;
          updatePeer('local_track', localAudio.current);
        }
        localAudio.current.enabled = true;
      }
      updateState({ audioEnabled: true });
    },
    disableAudio: async () => {
      if (!call.current) {
        throw new Error('cannot mute audio');
      }
      if (localAudio.current) {
        localAudio.current.enabled = false;
      }
      updateState({ audioEnabled: false });
    },
    enableVideo: async () => {
      if (closing.current || !call.current) {
        throw new Error('cannot start video');
      }
      if (!localVideo.current) {
        throw new Error('video not available');
      } else {
        if (!localVideoAdded.current) {
          localVideoAdded.current = true;
          localStream.current.addTrack(localVideo.current, localStream.current);
          updatePeer('local_track', localVideo.current);
        }
        localVideo.current.enabled = true;
      }
      updateState({ videoEnabled: true });
    },
    disableVideo: async () => {
      if (!call.current) {
        throw new Error('cannot stop video');
      }
      if (localVideo.current) {
        localVideo.current.enabled = false;
      }
      updateState({ videoEnabled: false });
    },
  };

  return { state, actions };
}

