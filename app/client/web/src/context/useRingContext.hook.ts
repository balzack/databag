import { useState, useContext, useEffect, useRef } from 'react'
import { DisplayContext } from '../context/DisplayContext';
import { AppContext } from '../context/AppContext'
import { ContextType } from '../context/ContextType'
import { Link, type Card } from 'databag-client-sdk';

const CLOSE_POLL_MS = 100;

export function useRingContext() {
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const call = useRef(null as { peer: RTCPeerConnection, link: Link, candidates: RTCIceCandidate[] } | null);
  const localStream = useRef(null as null|MediaStream);
  const localAudio = useRef(null as null|MediaStreamTrack);
  const localVideo = useRef(null as null|MediaStreamTrack);
  const remoteStream = useRef(null as null|MediaStream);
  const updatingPeer = useRef(false);
  const peerUpdate = useRef([] as {type: string, data?: any}[]);
  const connecting = useRef(false);
  const closing = useRef(false);
  const passive = useRef(false);
  const passiveTracks = useRef([] as { track: MediaStreamTrack, stream: MediaStream }[]);
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
    failed: false,
    fullscreen: false,
    connectedTime: 0,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const calls = ringing.map(ring => ({ callId: ring.callId, card: cards.find(card => ring.cardId === card.cardId) }))
      .filter(ring => (ring.card && !ring.card.blocked));
    updateState({ calls });
  }, [ringing, cards]);

  const getAudioStream = async (audioId: null|string) => {
    try {
      if (audioId) {
        return await navigator.mediaDevices.getUserMedia({ video: false, audio: { deviceId: audioId } });
      }
    } 
    catch (err) {
      console.log(err); 
    }     
    return await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
  }           
            
  const getVideoStream = async (videoId: null|string) => {
    try { 
      if (videoId) {
        return await navigator.mediaDevices.getUserMedia({ video: { deviceId: videoId }, audio: false });
      } 
    } 
    catch (err) {
      console.log(err);
    }
    return await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  }

  const linkStatus = async (status: string) => {
    if (call.current) {
      const { peer, link } = call.current;
      if (status === 'connected') {
        const connectedTime = Math.floor((new Date()).getTime() / 1000);
        updateState({ connected: true, connectedTime });
        try {
          await actions.enableAudio();
        } catch (err) {
          console.log('failed to enable audio on connection');
          console.log(err);
        }
      } else if (status === 'closed') {
        await cleanup();
      }
    }
  }

  const updatePeer = async (type: string, data?: any) => {
    peerUpdate.current.push({ type, data });

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
                  const description = await peer.createAnswer();
                  await peer.setLocalDescription(description);
                  link.sendMessage({ description });
                }
                for (const candidate of candidates) {
                  await peer.addIceCandidate(candidate);
                };
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
                passiveTracks.current.forEach(data => {
                  peer.addTrack(data.track, data.stream);
                });
                passiveTracks.current = []; 
                if (data.kind === 'video') {
                  updateState({ remoteVideo: true });
                }
              }
              break;
            case 'local_track':
              if (passive.current) {
                passiveTracks.current.push(data);
              } else {
                peer.addTrack(data.track, data.stream);
              }
              if (data.track.kind === 'audio') {
                localAudio.current = data.track;
              }
              if (data.track.kind === 'video') {
                localVideo.current = data.track;
                localStream.current = data.stream;
                updateState({ localVideo: true, localStream: localStream.current })
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
  }

  const setup = async (link: Link, card: Card, polite: boolean) => {
    passive.current = polite;
    localAudio.current = null;
    localVideo.current = null;
    localStream.current = null;
    remoteStream.current = new MediaStream();
    const ice = link.getIce();
    const peer = transmit(ice);
    const candidates = [] as RTCIceCandidate[];
    call.current = { peer, link, candidates };
    link.setStatusListener(linkStatus);
    link.setMessageListener((msg: any) => updatePeer('message', msg));
    updateState({ calling: card, failed: false, connected: false, connectedTime: 0,
      audioEnabled: false, videoEnabled: false, localVideo: false, remoteVideo: false,
      localStream: localStream.current, remoteStream: remoteStream.current });
  }

  const cleanup = async () => {
console.log("CLEANUP!");
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
    }
    if (localAudio.current) {
      localAudio.current.stop();
      localAudio.current = null;
    }
    localStream.current = null;
    remoteStream.current = null,
    peerUpdate.current = [];
    updateState({ calling: null, connected: false, connectedTime: 0, failed: false, localStream: null, remoteStream: null, localVideo: false, remoteVideo: false });
    closing.current = false;
console.log("!!");
  }

  const transmit = (ice: { urls: string; username: string; credential: string }[]) => {
    const peerConnection = new RTCPeerConnection({ iceServers: ice });
    peerConnection.addEventListener( 'connectionstatechange', event => {
      console.log("CONNECTION STATE", event);
    });
    peerConnection.addEventListener( 'icecandidate', event => {
      updatePeer('candidate', event.candidate);
    });
    peerConnection.addEventListener( 'icecandidateerror', event => {
      console.log("ICE ERROR");
    });
    peerConnection.addEventListener( 'iceconnectionstatechange', event => {
      console.log("ICE STATE CHANGE", event);
    });
    peerConnection.addEventListener( 'negotiationneeded', event => {
      updatePeer('negotiate');
    });
    peerConnection.addEventListener( 'signalingstatechange', event => {
      console.log("ICE SIGNALING", event);
    });
    peerConnection.addEventListener( 'track', event => {
      updatePeer('remote_track', event.track);
    });
    return peerConnection;
  }

  useEffect(() => {
    if (app.state.session) {
      const setRing = (ringing: { cardId: string, callId: string }[]) => {
        setRinging(ringing);
      }
      const setContacts = (cards: Card[]) => {
        setCards(cards);
      }
      const ring = app.state.session.getRing();
      ring.addRingingListener(setRinging);
      const contact = app.state.session.getContact();
      contact.addCardListener(setContacts);
      return () => {
        ring.removeRingingListener(setRing);
        contact.removeCardListener(setContacts);
        cleanup();
      }
    }
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
      if (connecting.current || closing.current || !call.current) {
        throw new Error('cannot unmute audio');
      }
      if (!localAudio.current) {
        try {
          connecting.current = true;
          const audioStream = await getAudioStream(null);
          const audioTrack = audioStream.getTracks().find((track: MediaStreamTrack) => track.kind === 'audio');
          if (!audioTrack) {
            throw new Error('no available audio track');
          }
          updatePeer('local_track', { track: audioTrack, stream: audioStream });
          connecting.current = false;
        } catch (err) {
          connecting.current = false;
          throw err;
        }  
      } else {
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
      if (connecting.current || closing.current || !call.current) {
        throw new Error('cannot start video');
      }
      if (!localVideo.current) {
        try {
          connecting.current = true;
          const videoStream = await getVideoStream(null);
          const videoTrack = videoStream.getTracks().find((track: MediaStreamTrack) => track.kind === 'video');
          if (videoTrack) {
            updatePeer('local_track', { track: videoTrack, stream: videoStream });
          }
          connecting.current = false;
        } catch (err) {
          connecting.current = false;
          throw err;
        }
      } else {
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
  }

  return { state, actions }
}

