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
  });
  const access = useRef(null);

  const EXPIRE = 3000000
  const ringing = useRef(new Map());
  const calling = useRef(null);
  const ws = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
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
    ring: (cardId, callId, calleeToken) => {
      const key = `${cardId}:${callId}`
      const call = ringing.current.get(key) || { cardId, calleeToken, callId }
      call.expires = Date.now() + EXPIRE;
      ringing.current.set(key, call);
      updateState({ ringing: ringing.current });
      setTimeout(() => {
        updateState({ ringing: ringing.current });
      }, 3000);
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
    decline: (cardId, callId) => {
      const key = `${cardId}:${callId}`
      const call = ringing.current.get(key);
      if (call) {
        call.status = 'declined'
        ringing.current.set(key, call);
        updateState({ ringing: ringing.current });
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
        calling.current = { state: "connecting", callId, contactNode, contactToken, host: false };
        updateState({ callStatus: "connecting" });
        ws.current = createWebsocket(`wss://${contactNode}/signal`);
        ws.current.onmessage = (ev) => {
          // handle messages [impolite]
          console.log(ev);
        }
        ws.current.onclose = (e) => {
          // update state to disconnected
          calling.current = null;
          updateState({ calling: null });
        }
        ws.current.onopen = () => {
          calling.current.state = "connected"
          updateState({ callStatus: "connected" });
          ws.current.send(JSON.stringify({ AppToken: calleeToken }))
        }
        ws.current.error = (e) => {
          console.log(e)
          ws.current.close();
        }
      }
    },
    end: async () => {
      if (!calling.current) {
        throw new Error('inactive session');
      }
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
      ws.current.close();
    },
    call: async (cardId, contactNode, contactToken) => {
      if (calling.current) {
        throw new Error("active session");
      }

      // create call
      const call = await addCall(access.current, cardId);
      const { callId, keepAlive, callerToken, calleeToken } = call;
      const aliveInterval = setInterval(async () => {
        try {
          await keepCall(access.current, call.callId);
        }
        catch (err) {
          console.log(err);
        }
      }, keepAlive * 1000);
      let index = 0;
      const ringInterval = setInterval(async () => {
        try {
          await addContactRing(contactNode, contactToken, { index, callId, calleeToken });
          index += 1;
        }
        catch (err) {
          console.log(err);
        }
      }, 3000);
      calling.current = { state: "connecting", callId, host: true };
      updateState({ callStatus: "connecting" });
      const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
      ws.current = createWebsocket(`${protocol}${window.location.host}/signal`);
      ws.current.onmessage = (ev) => {
        // handle messages [polite]
        // on connected stop ringing
        console.log(ev);
      }
      ws.current.onclose = (e) => {
        clearInterval(ringInterval);
        clearInterval(aliveInterval);
        calling.current = null;
        updateState({ callStatus: null });
      }
      ws.current.onopen = () => {
        calling.current.state = "ringing";
        updateState({ callStatus: "ringing" });
        ws.current.send(JSON.stringify({ AppToken: callerToken }))
      }
      ws.current.error = (e) => {
        console.log(e)
        ws.current.close();
      }
    },
  }

  return { state, actions }
}


