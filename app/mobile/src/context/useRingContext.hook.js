import { useEffect, useContext, useState, useRef } from 'react';
import { Alert } from 'react-native';
import { createWebsocket } from 'api/fetchUtil';
import { addContactRing } from 'api/addContactRing';
import { addCall } from 'api/addCall';
import { keepCall } from 'api/keepCall';
import { removeCall } from 'api/removeCall';
import { removeContactCall } from 'api/removeContactCall';
import InCallManager from 'react-native-incall-manager';

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
  const RING_COUNT = 10
  const ringing = useRef(new Map());
  const calling = useRef(null);
  const ws = useRef(null);
  const pc = useRef(null);
  const stream = useRef(null);
  const videoTrack = useRef();
  const audioTrack = useRef();
  const offers = useRef([]);
  const processing = useRef(false);
  const connected = useRef(false);
  const candidates = useRef([]);

  const constraints = {
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: false,
      VoiceActivityDetection: true
    }
  };

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const polite = async () => {
    if (processing.current || !connected.current) {
      return;
    }

    processing.current = true;

    while (offers.current.length > 0) {
      const descriptions = offers.current;
      offers.current = [];

      try {
        for (let i = 0; i < descriptions.length; i++) {
          const description = descriptions[i];
          stream.current = null;

          if (description == null) {
            const offer = await pc.current.createOffer(constraints);
            await pc.current.setLocalDescription(offer);
            ws.current.send(JSON.stringify({ description: offer }));
          }
          else {
            if (description.type === 'offer' && pc.current.signalingState !== 'stable') {
              const rollback = new RTCSessionDescription({ type: "rollback" });
              await pc.current.setLocalDescription(rollback);
            }
            const offer = new RTCSessionDescription(description);
            await pc.current.setRemoteDescription(offer);
            if (description.type === 'offer') {
              const answer = await pc.current.createAnswer();
              await pc.current.setLocalDescription(answer);
              ws.current.send(JSON.stringify({ description: answer }));
            }
            const servers = candidates.current;
            candidates.current = [];
            for (let i = 0; i < servers.length; i++) {
              const candidate = new RTCIceCandidate(servers[i]);
              await pc.current.addIceCandidate(candidate);
            }
          }
        }
      }
      catch (err) {
        Alert.alert('webrtc error', err.toString());
      }
    }

    processing.current = false;
  }

  const impolite = async () => {
    if (processing.current || !connected.current) {
      return;
    }

    processing.current = true;
    while (offers.current.length > 0) {
      const descriptions = offers.current;
      offers.current = [];

      for (let i = 0; i < descriptions.length; i++) {
        const description = descriptions[i];
        stream.current = null;

        try {
          if (description == null) {
            const offer = await pc.current.createOffer(constraints);
            await pc.current.setLocalDescription(offer);
            ws.current.send(JSON.stringify({ description: offer }));
          }
          else {
            if (description.type === 'offer' && pc.current.signalingState !== 'stable') {
              continue;
            }

            const offer = new RTCSessionDescription(description);
            await pc.current.setRemoteDescription(offer);

            if (description.type === 'offer') {
              const answer = await pc.current.createAnswer();
              await pc.current.setLocalDescription(answer);
              ws.current.send(JSON.stringify({ description: answer }));
            }
            const servers = candidates.current;
            candidates.current = [];
            for (let i = 0; i < servers.length; i++) {
              const candidate = new RTCIceCandidate(servers[i]);
              await pc.current.addIceCandidate(candidate);
            }
          }
        }
        catch (err) {
          Alert.alert('webrtc error', err.toString());
        }
      }
    }
    processing.current = false;
  }

  const transmit = async (policy, ice) => {

    pc.current = new RTCPeerConnection({ iceServers: ice });
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
    pc.current.addEventListener( 'negotiationneeded', async (ev) => {
      offers.current.push(null);
      if (policy === 'polite') {
        polite();
      }
      if (policy === 'impolite') {
        impolite();
      }
    } );
    pc.current.addEventListener( 'signalingstatechange', event => {
      console.log("ICE SIGNALING", event);
    } );
    pc.current.addEventListener( 'track', event => {
      if (stream.current == null) {
        stream.current = new MediaStream();
        updateState({ remoteStream: stream.current });
      }
      if (event.track.kind === 'audio') {
        updateState({ remoteAudio: true });
      }
      if (event.track.kind === 'video') {
        updateState({ remoteVideo: true });
        InCallManager.setForceSpeakerphoneOn(true);
      }
      stream.current.addTrack(event.track, stream.current);
    } );

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
          audioTrack.current = track;
          pc.current.addTrack(track, stream);
          updateState({ localAudio: true });
        }
        if (track.kind === 'video') {
          track.enabled = false;
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const connect = async (policy, node, token, clearRing, clearAlive, ice) => {

    // connect signal socket
    connected.current = false;
    candidates.current = [];
    pc.current = null;
    updateState({ remoteVideo: false, remoteAudio: false, remoteStream: null, localVideo: false, localAudio: false, localStream: null });

    videoTrack.current = false;
    audioTrack.current = false;

    ws.current = createWebsocket(`wss://${node}/signal`);
    ws.current.onmessage = async (ev) => {
      // handle messages [impolite]
      try {
        const signal = JSON.parse(ev.data);
        if (signal.status === 'connected') {
          clearRing();
          updateState({ callStatus: "connected" });
          if (policy === 'polite') {
            connected.current = true;
            InCallManager.start({media: 'audio'});
            transmit('polite', ice);
            polite();
          }
        }
        else if (signal.status === 'closed') {
          ws.current.close();
        }
        else if (signal.description) {
          offers.current.push(signal.description);
          if (policy === 'polite') {
            polite();
          }
          if (policy === 'impolite') {
            impolite();
          }
        }
        else if (signal.candidate) {
          if (pc.current.remoteDescription == null) {
            candidates.current.push(signal.candidate);
          }
          else {
            const candidate = new RTCIceCandidate(signal.candidate);
            await pc.current.addIceCandidate(candidate);
          }
        }
      }
      catch (err) {
        console.log(err);
      }
    }
    ws.current.onclose = (e) => {
      // update state to disconnected
      if (pc.current) {
        pc.current.close();
      }
      clearRing();
      clearAlive();
      InCallManager.stop();
      connected.current = false;
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
      ws.current.send(JSON.stringify({ AppToken: token }));
      if (policy === 'impolite') {
        connected.current = true;
        InCallManager.start({media: 'audio'});
        transmit('impolite', ice);
        impolite();
      }
    }
    ws.current.error = (e) => {
      console.log(e)
      ws.current.close();
    }
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
    ring: (cardId, callId, calleeToken, iceUrl, iceUsername, icePassword) => {
      const key = `${cardId}:${callId}`
      const call = ringing.current.get(key) || { cardId, calleeToken, callId, iceUrl, iceUsername, icePassword }
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
    accept: async (cardId, callId, contactNode, contactToken, calleeToken, iceUrl, iceUsername, icePassword) => {
      if (calling.current) {
        throw new Error("active session");
      }

      const key = `${cardId}:${callId}`
      const call = ringing.current.get(key);
      if (call) {
        call.status = 'accepted'
        ringing.current.set(key, call);
        updateState({ ringing: ringing.current, callStatus: "connecting", cardId });

        calling.current = { callId, contactNode, contactToken, host: false };
        const ice = [{ urls: iceUrl, username: iceUsername, credential: icePassword }];
        await connect('impolite', contactNode, calleeToken, () => {}, () => {}, ice);
      }
    },
    end: async () => {
      if (!calling.current) {
        throw new Error('inactive session');
      }
      try {
        const { host, callId, contactNode, contactToken } = calling.current;
        if (host) {
          const { server, token } = access.current;
          await removeCall(server, token, callId);
        }
        else {
          await removeContactCall(contactNode, contactToken, callId);
        }
      }
      catch (err) {
        console.log(err);
      }
      ws.current.close();
    },
    call: async (cardId, contactNode, contactToken) => {
      if (calling.current) {
        throw new Error("active session");
      }

      // create call
      const { server, token } = access.current;
      const call = await addCall(server, token, cardId);
      const { id, keepAlive, callerToken, calleeToken, iceUrl, iceUsername, icePassword } = call;
      try {
        await addContactRing(contactNode, contactToken, { index, callId: id, calleeToken, iceUrl, iceUsername, icePassword });
      }
      catch (err) {
        console.log(err);
      }
      const aliveInterval = setInterval(async () => {
        try {
          await keepCall(server, token, id);
        }
        catch (err) {
          console.log(err);
        }
      }, keepAlive * 1000);
      let index = 0;
      const ringInterval = setInterval(async () => {
        try {
          if (index > RING_COUNT) {
            if (ws.current) {
              ws.current.close();
            } 
          }
          else {
            await addContactRing(contactNode, contactToken, { index, callId: id, calleeToken, iceUrl, iceUsername, icePassword });
            index += 1;
          }
        }
        catch (err) {
          console.log(err);
        }
      }, RING);

      updateState({ callStatus: "ringing", cardId });
      calling.current = { callId: id, host: true };
      const ice = [{ urls: iceUrl, username: iceUsername, credential: icePassword }];
      await connect('polite', server, callerToken, () => clearInterval(ringInterval), () => clearInterval(aliveInterval), ice);
    },
    enableVideo: async () => {
      if (!videoTrack.current) {
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
              audioTrack.current = track;
              pc.current.addTrack(track, stream);
              updateState({ localAudio: true });
            }
            if (track.kind === 'video') {
              videoTrack.current = track;
              pc.current.addTrack(track, stream);
              InCallManager.setForceSpeakerphoneOn(true);
              const localStream = new MediaStream();
              localStream.addTrack(track, localStream);
              updateState({ localVideo: true, localStream });
            }
          }
        }
        catch (err) {
          console.log(err);
        }
      }
      else {
        videoTrack.current.enabled = true;
        updateState({ localVideo: true });
      }
    },
    disableVideo: async () => {
      if (videoTrack.current) {
        videoTrack.current.enabled = false;
        updateState({ localVideo: false });
      }
    },
    enableAudio: async () => {
      if (audioTrack.current) {
        audioTrack.current.enabled = true;
        updateState({ localAudio: true });
      }
    },
    disableAudio: async () => {
      if (audioTrack.current) {
        audioTrack.current.enabled = false;
        updateState({ localAudio: false });
      }
    },
  }

  return { state, actions }
}

