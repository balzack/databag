import { useEffect, useContext, useState, useRef } from 'react';
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
console.log("RING");
    },
    ignore: (cardId, callId) => {
    },
    decline: async (cardId, contactNode, contactToken, callId) => {
    },
    accept: async (cardId, callId, contactNode, contactToken, calleeToken) => {
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

