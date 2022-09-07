import { useEffect, useState, useRef, useContext } from 'react';
import { getAvailable } from 'api/getAvailable';
import { setLogin } from 'api/setLogin';
import { setAccountAccess } from 'api/setAccountAccess';
import { addAccount } from 'api/addAccount';
import { getUsername } from 'api/getUsername';

export function useAppContext() {
  const [state, setState] = useState({});
  const [appRevision, setAppRevision] = useState();

  const delay = useRef(2);
  const ws = useRef(null);
  const revision = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const resetData = () => {
    revision.current = null;
    setState({});
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
    await addAccount(username, password, token);
    let access = await setLogin(username, password)
    setWebsocket(access.appToken)
    return access.created;
  } 

  const appLogin = async (username, password) => {
    let access = await setLogin(username, password)
    setWebsocket(access.appToken)
    return access.created;
  }

  const appLogout = () => {
    clearWebsocket()
  }

  const setWebsocket = (token) => {

    let protocol;
    if (window.location.protocol === 'http:') {
      protocol = 'ws://';
    }
    else {
      protocol = 'wss://';
    }

    ws.current = new WebSocket(protocol + window.location.host + "/status");
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
    // pull store set websocket
  }, []);

  return { state, actions }
}

