import { useState, useContext, useEffect, useRef } from 'react'
import { DisplayContext } from '../context/DisplayContext';
import { AppContext } from '../context/AppContext'
import { ContextType } from '../context/ContextType'
import { Link, type Card } from 'databag-client-sdk';

export type Ring = {
  callId: string,
  card: Card,
}

export function useCalling() {
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const call = useRef(null as { policy: string, peer: RTCPeerConnection, link: Link, candidates: RTCIceCandidate[] } | null);
  const localStream = useRef(null as null|MediaStream);
  const localAudio = useRef(null as null|MediaStreamTrack);
  const localVideo = useRef(null as null|MediaStreamTrack);
  const remoteStream = useRef(null as null|MediaStream);
  const updatingPeer = useRef(false);
  const peerUpdate = useRef([] as {type: string, data?: any}[]);

  const [state, setState] = useState({
    strings: display.state.strings, 
    ringing: [] as { cardId: string, callId: string }[],
    calls: [] as Ring[],
    cards: [] as Card[],
    calling: null as null | Card,
    failed: false,
    loaded: false,
    localStream: null as null|MediaStream,
    remoteStream: null as null|MediaStream,
    localVideo: false,
    remoteVideo: false,
    audioEnabled: false,
    videoEnabled: false,
    connected: false,
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
      const { policy, peer, link } = call.current;
      if (status === 'connected') {
        localVideo.current = null;
        localStream.current = null;
        remoteStream.current = new MediaStream();
        updateState({ localStream: localStream.current, remoteStream: remoteStream.current,
          audioEnabled: false, videoEnabled: false, localVideo: false, remoteVideo: false, connected: true });

        try {
          const audioStream = await getAudioStream(null);
          const audioTrack = audioStream.getTracks().find((track: MediaStreamTrack) => track.kind === 'audio');
          if (audioTrack) {
            localAudio.current = audioTrack;
          }
          if (localAudio.current) {
            localAudio.current.enabled = true;
            await updatePeer('local_track', { track: audioTrack, stream: audioStream });
            updateState({ audioEnabled: true }); 
          }
        } catch (err) {
          console.log(err);
        }
      } else if (status === 'closed') {
        updatePeer('close');
      }
    }
  }

  const linkMessage = async (message: any) => {
    if (call.current) {
      const { peer, link, policy, candidates } = call.current;
      try {
        if (message.description) {
          const offer = new RTCSessionDescription(message.description);
          await peer.setRemoteDescription(offer);
          if (message.description.type === 'offer') {
            const description = await peer.createAnswer();
            await peer.setLocalDescription(description);
            link.sendMessage({ description });
          }

          if (call.current) {
            for (const candidate of candidates) {
              await peer.addIceCandidate(candidate);
            };
            call.current.candidates = [];
          }
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

  const peerCandidate = async (candidate: RTCIceCandidate) => {
    if (call.current && candidate) {
      const { link } = call.current;
      await link.sendMessage({ candidate });
    }
  }

  const peerNegotiate = async () => {
    if (call.current) {
      try {
        const { peer, link } = call.current;
        const description = await peer.createOffer();
        await peer.setLocalDescription(description);
        await link.sendMessage({ description });
      } catch (err) {
        console.log(err);
      }
    }
  }

  const peerTrack = async (track: MediaStreamTrack, stream: MediaStream) => {
    if (call.current && localStream.current) {
      try {
        const { peer } = call.current;
        peer.addTrack(track, stream);
      } catch (err) {
        console.log(err);
      }
    }
  }

  const updatePeer = async (type: string, data?: any) => {
    peerUpdate.current.push({ type, data });

    if (!updatingPeer.current) {
      updatingPeer.current = true;
      while (peerUpdate.current.length > 0) {
        const { type, data } = peerUpdate.current.shift() || { type: '' };
        if (type === 'negotiate') {
          await peerNegotiate();
        } else if (type === 'candidate') {
          await peerCandidate(data);
        } else if (type === 'message') {
          await linkMessage(data);
        } else if (type === 'remote_track') {
          if (remoteStream.current) {
            remoteStream.current.addTrack(data);
            if (data.kind === 'video') {
              updateState({ remoteVideo: true });
            }
          }
        } else if (type === 'local_track') {
          await peerTrack(data.track, data.stream);
        } else if (type === 'close' && call.current) {
          peerUpdate.current = [];
          const { peer, link } = call.current;
          call.current = null;
          try {
            peer.close();
            link.close();
          } catch (err) {
            console.log(err);
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
          updateState({ calling: null, failed: false, localStream: null, remoteStream: null, localVideo: false, remoteVideo: false });
        }
      }
      updatingPeer.current = false;
    }
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
    ignore: async (callId: string, card: Card) => {
      const ring = app.state.session.getRing();
      await ring.ignore(card.cardId, callId);
    },
    decline: async (callId: string, card: Card) => {
      const ring = app.state.session.getRing();
      await ring.decline(card.cardId, callId);
    },
    end: async () => {
      if (!call.current) {
        throw new Error('no active call');
      }
      await updatePeer('close');
    },
    accept: async (callId: string, card: Card) => {
      if (call.current) {
        throw new Error('active call in progress');
      }
      const { cardId, node } = card;
      const ring = app.state.session.getRing();
      const link = await ring.accept(cardId, callId, node);
      const ice = link.getIce();
      const peer = transmit(ice);
      const policy = 'impolite';
      const candidates = [] as RTCIceCandidate[];
      call.current = { policy, peer, link, candidates }; 
      link.setStatusListener(linkStatus);
      link.setMessageListener((msg: any) => updatePeer('message', msg));
      updateState({ calling: card, connected: false });
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
      const candidates = [] as RTCIceCandidate[];
      call.current = { policy, peer, link, candidates };
      link.setStatusListener(linkStatus);
      link.setMessageListener((msg: any) => updatePeer('message', msg));
      updateState({ calling: card, connected: false });
    },
    enableAudio: async () => {
      if (!call.current) {
        throw new Error('cannot unmute audio');
      }
      if (!localAudio.current) {
        const audioStream = await getAudioStream(null);
        const audioTrack = audioStream.getTracks().find((track: MediaStreamTrack) => track.kind === 'audio');
        if (!audioTrack) {
          throw new Error('no available audio track');
        } 
        localAudio.current = audioTrack;
        localStream.current = audioStream;
        updatePeer('local_track', { track: audioTrack, stream: audioStream });
        updateState({ localAudio: true, localStream: audioStream, audioEnabled: true });
      } else {
        localAudio.current.enabled = true;
        updateState({ audioEnabled: true });
      }
    },
    disableAudio: async () => {
      if (!call.current) {
        throw new Error('cannot mute audio');
      }
      if (localAudio.current) {
        localAudio.current.enabled = false;
        updateState({ audioEnabled: false });
      }
    },
    enableVideo: async () => {
      if (!call.current) {
        throw new Error('cannot start video');
      }
      if (!localVideo.current) {
        const videoStream = await getVideoStream(null);
        const videoTrack = videoStream.getTracks().find((track: MediaStreamTrack) => track.kind === 'video');
        if (videoTrack) {
          localVideo.current = videoTrack;
          localStream.current = videoStream;
          updatePeer('local_track', { track: videoTrack, stream: videoStream });
          updateState({ localVideo: true, localStream: videoStream });
        }
      }
      if (localVideo.current) {
        localVideo.current.enabled = true;
        updateState({ videoEnabled: true });
      }
    },
    disableVideo: async () => {
      if (!call.current) {
        throw new Error('cannot stop video');
      }
      if (localVideo.current) {
        localVideo.current.enabled = false;
        updateState({ videoEnabled: false });
      }
    },
  }

  return { state, actions }
}
