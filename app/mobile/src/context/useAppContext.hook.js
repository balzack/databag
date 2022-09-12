import { useEffect, useState, useRef, useContext } from 'react';
import { getAvailable } from 'api/getAvailable';
import { setLogin } from 'api/setLogin';
import { setAccountAccess } from 'api/setAccountAccess';
import { addAccount } from 'api/addAccount';
import { getUsername } from 'api/getUsername';
import { StoreContext } from 'context/StoreContext';

export function useAppContext() {
  const [state, setState] = useState({
    session: null,
    disconnected: null,
  });
  const [appRevision, setAppRevision] = useState();
  const store = useContext(StoreContext);

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
    const access = await setLogin(acc[0], acc[1], password)
    store.actions.setSession({ ...access, server: acc[1] });
  } 

  const appLogin = async (username, password) => {
    const acc = username.split('@');
    const access = await setLogin(acc[0], acc[1], password)
    store.actions.setSession({ ...access, server: acc[1] }); 
  }

  const appLogout = () => {
    store.actions.clearSession();
  }

  const setWebsocket = (server, token) => {
    clearWebsocket();
    ws.current = new WebSocket(`wss://${server}/status`);
    ws.current.onmessage = (ev) => {
      try {
        const rev = JSON.parse(ev.data);
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
    if (ws.current) {
      ws.current.onclose = () => {}
      ws.current.close()
      ws.current = null
    }
  }

  useEffect(() => {
    if (store.state.init) {
      if (store.state.session) {
        const { server, appToken } = store.state.session;
        setWebsocket(server, appToken);
        updateState({ session: true });
      }
      else {
        clearWebsocket();
        updateState({ session: false });
      }
    }
  }, [store.state.session, store.state.init]);

  return { state, actions }
}

