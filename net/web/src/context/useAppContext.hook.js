import { useEffect, useState, useRef, useContext } from 'react';
import { getAvailable } from 'api/getAvailable';
import { setLogin } from 'api/setLogin';
import { clearLogin } from 'api/clearLogin';
import { setAccountAccess } from 'api/setAccountAccess';
import { addAccount } from 'api/addAccount';
import { getUsername } from 'api/getUsername';
import { AccountContext } from './AccountContext';
import { ProfileContext } from './ProfileContext';
import { CardContext } from './CardContext';
import { ChannelContext } from './ChannelContext';
import { StoreContext } from './StoreContext';
import { UploadContext } from './UploadContext';

export function useAppContext() {
  const [state, setState] = useState({
  });
  const [appRevision, setAppRevision] = useState();

  const appName = "Databag";
  const appVersion = "1.0.0";
  const userAgent = window.navigator.userAgent;

  const ws = useRef(null);
  const revision = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const uploadContext = useContext(UploadContext);
  const storeContext = useContext(StoreContext);
  const accountContext = useContext(AccountContext);
  const profileContext = useContext(ProfileContext);
  const channelContext = useContext(ChannelContext);
  const cardContext = useContext(CardContext);

  const resetData = () => {
    revision.current = null;
    accountContext.actions.clearToken();
    profileContext.actions.clearToken();
    cardContext.actions.clearToken();
    channelContext.actions.clearToken();
    setState({});
  }

  const actions = {
    logout: () => {
      appLogout();
      storeContext.actions.clear();
      uploadContext.actions.clear();
      resetData();
    },
    access: async (token) => {
      await appAccess(token)
    },
    login: async (username, password) => {
      await appLogin(username, password)
    },
    create: async (username, password, token) => {
      await appCreate(username, password, token)
    },
    username: getUsername,
    available: getAvailable,
  }

  const appCreate = async (username, password, token) => {
    await addAccount(username, password, token);
    let access = await setLogin(username, password, appName, appVersion, userAgent)
    updateState({ access: access.appToken });
    storeContext.actions.setValue('login:timestamp', access.created);
    setWebsocket(access.appToken)
    localStorage.setItem("session", JSON.stringify({
      access: access.appToken,
      timestamp: access.created,
    }));
    return access.created;
  } 

  const appLogin = async (username, password) => {
    let access = await setLogin(username, password, appName, appVersion, userAgent)
    updateState({ access: access.appToken });
    storeContext.actions.setValue('login:timestamp', access.created);
    setWebsocket(access.appToken)
    localStorage.setItem("session", JSON.stringify({
      access: access.appToken,
      timestamp: access.created,
    }));
    return access.created;
  }

  const appAccess = async (token) => {
    let access = await setAccountAccess(token, appName, appVersion, userAgent)
    updateState({ access: access.appToken });
    storeContext.actions.setValue('login:timestamp', access.created);
    setWebsocket(access.appToken)
    localStorage.setItem("session", JSON.stringify({
      access: access.appToken,
      timestamp: access.created,
    }));
    return access.created;
  }

  const appLogout = async () => {
    try {
      await clearLogin(state.access);
    }
    catch (err) {
      console.log(err);
    }
    updateState({ access: null });
    clearWebsocket()
    localStorage.removeItem("session");
  }

  useEffect(() => {
    if (appRevision) {
      accountContext.actions.setRevision(appRevision.account);
      profileContext.actions.setRevision(appRevision.profile);
      cardContext.actions.setRevision(appRevision.card);
      channelContext.actions.setRevision(appRevision.channel);
    }
    // eslint-disable-next-line
  }, [appRevision]);
  
  const setWebsocket = (token) => {

    accountContext.actions.setToken(token);
    profileContext.actions.setToken(token);
    cardContext.actions.setToken(token);
    channelContext.actions.setToken(token);

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
        }
      }, 1000)
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
    const storage = localStorage.getItem('session');
    if (storage != null) {
      try {
        const session = JSON.parse(storage)
        if (session?.access) {
          setState({ access: session.access })
          setWebsocket(session.access);   
        } else {
          setState({})
        }
      }
      catch(err) {
        console.log(err)
        setState({})
      }
    } else {
      setState({})
    }
    // eslint-disable-next-line
  }, []);

  if (state == null) {
    return {};
  }
  return { state, actions }
}


