import { useEffect, useState, useRef, useContext } from 'react';
import { getAvailable } from 'api/getAvailable';
import { setLogin } from 'api/setLogin';
import { setAccountAccess } from 'api/setAccountAccess';
import { addAccount } from 'api/addAccount';
import { getUsername } from 'api/getUsername';

export function useAppContext() {
  const [state, setState] = useState({
    session: null,
    disconnected: null,
    server: null,
    token: null,
  });
  const [appRevision, setAppRevision] = useState();

  const delay = useRef(2);
  const ws = useRef(null);
  const revision = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const resetData = () => {
    revision.current = null;
  }

  const actions = {
    available: getAvailable,
    username: getUsername,
    create: async (username, password, token) => {
      await appCreate(username, password, token)
    },
    login: async (username, password) => {
      await appLogin(username, password)
    },
    logout: () => {
      appLogout();
      resetData();
    },
  }

  const appCreate = async (username, password, token) => {
    const acc = username.split('@');
    await addAccount(acc[0], acc[1], password, token);
    let access = await setLogin(acc[0], acc[1], password)
    setWebsocket(acc[1], access.appToken)
    updateState({ session: true, token: access.appToken, server: acc[1] });
    // store 
  } 

  const appLogin = async (username, password) => {
    const acc = username.split('@');
    let access = await setLogin(acc[0], acc[1], password)
console.log(access);
    setWebsocket(acc[1], access.appToken)
    updateState({ session: true, token: access.appToken, server: acc[1] });
    // store
  }

  const appLogout = () => {
    clearWebsocket();
    updateState({ session: false, });
    // store
  }

  const setWebsocket = (server, token) => {

    ws.current = new WebSocket(`wss://${server}/status`);
    ws.current.onmessage = (ev) => {
      try {
        let rev = JSON.parse(ev.data);
        setAppRevision(rev);
        updateState({ disconnected: false });
      }
      catch (err) {
        console.log(err);
      }
    }
    ws.current.onclose = (e) => {
      updateState({ disconnected: true });
      console.log(e)
      setTimeout(() => {
        if (ws.current != null) {
          ws.current.onmessage = () => {}
          ws.current.onclose = () => {}
          ws.current.onopen = () => {}
          ws.current.onerror = () => {}
          setWebsocket(token);
          if (delay.current < 15) {
            delay.current += 1;
          }
        }
      }, delay.current * 1000)
    }
    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ AppToken: token }))
    }
    ws.current.error = (e) => {
      updateState({ disconnected: true });
      console.log(e)
    }
  }
 
  const clearWebsocket = ()  => {
    ws.current.onclose = () => {}
    ws.current.close()
    ws.current = null
  }

  useEffect(() => {
    updateState({ session: false });
    // pull store set websocket
  }, []);

  return { state, actions }
}

