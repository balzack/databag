import { useState, useRef } from 'react';
import { createWebsocket } from 'api/fetchUtil';
import { addContactRing } from 'api/addContactRing';
import { addCall } from 'api/addCall';
import { keepCall } from 'api/keepCall';
import { removeCall } from 'api/removeCall';
import { removeContactCall } from 'api/removeContactCall';

export function useRingContext() {
  const [state, setState] = useState({
    ringing: new Map(),
    callStatus: null,
    cardId: null,
    localStream: null,
    localVideo: false,
    localAudio: false,
    remoteStream: null,
    remoteVideo: false,
    remoteAudio: false,
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
  const accessVideo = useRef(false);
  const accessAudio = useRef(false);
  const videoTrack = useRef();
  const audioTrack = useRef();
  const offers = useRef([]);
  const processing = useRef(false);
  const connected = useRef(false);
  const candidates = useRef([]);

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
            const offer = await pc.current.createOffer();
            await pc.current.setLocalDescription(offer);
            ws.current.send(JSON.stringify({ description: pc.current.localDescription }));
          }
          else {
            if (description.type === 'offer' && pc.current.signalingState !== 'stable') {
              await pc.current.setLocalDescription({ type: "rollback" });
            }
            await pc.current.setRemoteDescription(description);
            if (description.type === 'offer') {
              const answer = await pc.current.createAnswer();
              await pc.current.setLocalDescription(answer);
              ws.current.send(JSON.stringify({ description: pc.current.localDescription }));
            }
            const servers = candidates.current;
            candidates.current = [];
            for (let i = 0; i < servers.length; i++) {
              await pc.current.addIceCandidate(servers[0]);
            }
          }
        }
      }
      catch (err) {
        alert('webrtc error:' + err.toString());
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
            const offer = await pc.current.createOffer();
            await pc.current.setLocalDescription(offer);
            ws.current.send(JSON.stringify({ description: pc.current.localDescription }));
          }
          else {
            if (description.type === 'offer' && pc.current.signalingState !== 'stable') {
              continue;
            }
            await pc.current.setRemoteDescription(description);
            if (description.type === 'offer') {
              const answer = await pc.current.createAnswer();
              await pc.current.setLocalDescription(answer);
              ws.current.send(JSON.stringify({ description: pc.current.localDescription }));
            }
            const servers = candidates.current;
            candidates.current = [];
            for (let i = 0; i < servers.length; i++) {
              await pc.current.addIceCandidate(servers[0]);
            }
          }
        }
        catch (err) {
          alert('webrtc error:' + err.toString());
        }
      }
    }

    processing.current = false;
  }

  const getAudioStream = async (audioId) => {
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

  const getVideoStream = async (videoId) => {
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

  const transmit = async (policy, ice, audioId) => {
    pc.current = new RTCPeerConnection({ iceServers: ice });
    pc.current.ontrack = (ev) => {
      if (!stream.current) {
        stream.current = new MediaStream();
        updateState({ remoteStream: stream.current });
      }
      if (ev.track.kind === 'audio') {
        updateState({ remoteAudio: true });
      }
      else if (ev.track.kind === 'video') {
        updateState({ remoteVideo: true });
      }
      stream.current.addTrack(ev.track);
    };
    pc.current.onicecandidate = ({candidate}) => {
      ws.current.send(JSON.stringify({ candidate }));
    };
    pc.current.onnegotiationneeded = async () => {
      offers.current.push(null);
      if (policy === 'polite') {
        polite();
      }
      if (policy === 'impolite') {
        impolite();
      }
    };

    try {
      const stream = await getAudioStream(audioId);
      accessAudio.current = true;
      updateState({ localAudio: true });
      for (const track of stream.getTracks()) {
        if (track.kind === 'audio') {
          audioTrack.current = track;
        }
        pc.current.addTrack(track);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const connect = async (policy, audioId, node, token, clearRing, clearAlive, ice) => {

    // connect signal socket
    connected.current = false;
    candidates.current = [];
    pc.current = null;
    updateState({ remoteVideo: false, remoteAudio: false, remoteStream: null, localVideo: false, localAudio: false, localStream: null });

    videoTrack.current = false;
    audioTrack.current = false;
    accessVideo.current = false;
    accessAudio.current = false;

    const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
    ws.current = createWebsocket(`${protocol}${node}/signal?mode=ring`);
    ws.current.onmessage = async (ev) => {
      // handle messages [impolite]
      try {
        const signal = JSON.parse(ev.data);
        if (signal.status === 'connected') {
          clearRing();
          updateState({ callStatus: "connected" });
          if (policy === 'polite') {
            connected.current = true;
            transmit('polite', ice, audioId);
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
            await pc.current.addIceCandidate(signal.candidate);
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
      calling.current = null;
      if (videoTrack.current) {
        videoTrack.current.stop();
        videoTrack.current = null;
      }
      if (audioTrack.current) {
        audioTrack.current.stop();
        audioTrack.current = null;
      }
      updateState({ callStatus: null, removeStream: null, localStream: null, remoteVideo: false, remoteAudio: false, localVideo: false, localAudio: false });
    }
    ws.current.onopen = async () => {
      ws.current.send(JSON.stringify({ AppToken: token }));
      if (policy === 'impolite') {
        connected.current = true;
        transmit('impolite', ice, audioId);
        impolite();
      }
    }
    ws.current.error = (e) => {
      console.log(e)
      ws.current.close();
    }
  }

  const actions = {
    setToken: (token) => {
      if (access.current) {
        throw new Error("invalid ring state");
      }
      access.current = token;
      ringing.current = new Map();
      calling.current = null;
      updateState({ callStatus: null, ringing: ringing.current });
    },
    clearToken: () => {
      access.current = null;
    },
    ring: (cardId, callId, calleeToken, ice) => {
      const key = `${cardId}:${callId}`
      const call = ringing.current.get(key) || { cardId, calleeToken, callId, ice }
      call.expires = Date.now() + EXPIRE;
      ringing.current.set(key, call);
      updateState({ ringing: ringing.current });
      setTimeout(() => {
        updateState({ ringing: ringing.current });
      }, EXPIRE);
    },
    ignore: (cardId, callId) => {
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
    accept: async (cardId, callId, contactNode, contactToken, calleeToken, ice, audioId) => {
console.log("ACCEPT", ice);

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
        await connect('impolite', audioId, contactNode, calleeToken, () => {}, () => {}, ice);
      }
    },
    end: async () => {
      if (calling.current?.callId) {
        try {
          const { host, callId, contactNode, contactToken } = calling.current;
          if (host) {
            await removeCall(access.current, callId);
          }
          else {
            await removeContactCall(contactNode, contactToken, callId);
          }
        }
        catch (err) {
          console.log(err);
        }
        if (ws.current) {
          ws.current.close();
        }
        if (videoTrack.current) {
          videoTrack.current.stop();
          videoTrack.current = null;
        }
        if (audioTrack.current) {
          audioTrack.current.stop();
          audioTrack.current = null;
        }
      }
    },
    call: async (cardId, contactNode, contactToken, audioId) => {
      if (calling.current) {
        throw new Error("active session");
      }

      calling.current = {};
      updateState({ callStatus: "dialing", cardId });

      // create call
      let call;
      try {
        call = await addCall(access.current, cardId);
      }
      catch (err) {
        calling.current = null;
        updateState({ callStatus: null, remoteStream: null, localStream: null, remoteVideo: false, remoteAudio: false, localVideo: false, localAudio: false });
      }

      let index = 0;
      const { id, keepAlive, callerToken, calleeToken, ice } = call;
      try {
        const turn = ice[ice.length - 1]; //backwards compatibility
        await addContactRing(contactNode, contactToken, { index, callId: id, calleeToken, ice, iceUrl: turn.urls, iceUsername: turn.username, icePassword: turn.credential });
      }
      catch (err) {
        console.log(err);
      }
      const aliveInterval = setInterval(async () => {
        try {
          await keepCall(access.current, id);
        }
        catch (err) {
          console.log(err);
        }
      }, keepAlive * 1000);
      const ringInterval = setInterval(async () => {
        try {
          if (index > RING_COUNT) {
            if (ws.current) {
              ws.current.close();
            }
          }
          else {
            const turn = ice[ice.length - 1];
            await addContactRing(contactNode, contactToken, { index, callId: id, calleeToken, ice, iceUrl: turn.urls, iceUsername: turn.username, icePassword: turn.credential });
            index += 1;
          }
        }
        catch (err) {
          console.log(err);
        }
      }, RING);

      updateState({ callStatus: "ringing" });
      calling.current = { callId: id, host: true };
      await connect('polite', audioId, window.location.host, callerToken, () => clearInterval(ringInterval), () => clearInterval(aliveInterval), ice);
    },
    enableVideo: async (videoId) => {
      if (!accessVideo.current) {
        const stream = await getVideoStream(videoId);
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
    getDevices: async (type) => {
      const filtered = new Map();
      const devices = await navigator.mediaDevices.enumerateDevices();
      devices.filter(item => item.kind === type + 'input').forEach(item => {
        if (item && item.label) {
          const entry = filtered.get(item.groupId);
          if (entry) {
            if (item.label && item.label.length < entry.label.length) {
              filtered.set(item.groupId, item);
            }
          }
          else {
            filtered.set(item.groupId, item);
          }
        }
      });
      return Array.from(filtered.values());
    },
  }

  return { state, actions }
}

