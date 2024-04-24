import { useEffect, useState, useRef, useContext } from 'react';
import { setLogin } from 'api/setLogin';
import { clearLogin } from 'api/clearLogin';
import { setAccountAccess } from 'api/setAccountAccess';
import { addAccount } from 'api/addAccount';
import { AccountContext } from './AccountContext';
import { ProfileContext } from './ProfileContext';
import { CardContext } from './CardContext';
import { ChannelContext } from './ChannelContext';
import { StoreContext } from './StoreContext';
import { UploadContext } from './UploadContext';
import { RingContext } from './RingContext';
import { createWebsocket } from 'api/fetchUtil';
const defaultState ={
  status: null,
  adminToken: null,
}
export const defaultAppContext = {
state:defaultState,
actions: {}as ReturnType<typeof useAppContext>["actions"],
}

export function useAppContext() {
  const [state, setState] = useState(defaultState);
  const [appRevision, setAppRevision] = useState<any>();

  const appName = "Databag";
  const appVersion = "1.0.0";
  const userAgent = window.navigator.userAgent;

  const checked = useRef(false);
  const appToken = useRef(null);
  const ws = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const ringContext = useContext(RingContext);
  const uploadContext = useContext(UploadContext);
  const storeContext = useContext(StoreContext);
  const accountContext = useContext(AccountContext);
  const profileContext = useContext(ProfileContext);
  const channelContext = useContext(ChannelContext);
  const cardContext = useContext(CardContext);

  const setSession = (token) => {
    try {
      accountContext.actions.setToken(token);
      profileContext.actions.setToken(token);
      cardContext.actions.setToken(token);
      channelContext.actions.setToken(token);
      ringContext.actions.setToken(token);
    }
    catch (err) {
      accountContext.actions.clearToken();
      profileContext.actions.clearToken();
      cardContext.actions.clearToken();
      channelContext.actions.clearToken();
      ringContext.actions.clearToken();
      throw err;
    }
    setWebsocket(token);
  }

  const clearSession = () => {
    uploadContext.actions.clear();
    storeContext.actions.clear();

    ringContext.actions.clearToken();
    accountContext.actions.clearToken();
    profileContext.actions.clearToken();
    cardContext.actions.clearToken();
    channelContext.actions.clearToken();
    clearWebsocket();
  }

  const actions = {
    logout: async (all) => {
      await appLogout(all);
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
    setAdmin: (token) => {
      updateState({ adminToken: token });
    },
    clearAdmin: () => {
      updateState({ adminToken: null });
    },
  }

  const appCreate = async (username, password, token) => {
    if (appToken.current || !checked.current) {
      throw new Error('invalid session state');
    }
    await addAccount(username, password, token);
    const access = await setLogin(username, password, appName, appVersion, userAgent);
    storeContext.actions.setValue('login:timestamp', access.created);
    setSession(access.appToken);
    appToken.current = access.appToken;

    localStorage.setItem("session", JSON.stringify({
      access: access.appToken,
      timestamp: access.created,
    }));
    return access.created;
  } 

  const appLogin = async (username, password) => {
    if (appToken.current || !checked.current) {
      throw new Error('invalid session state');
    }
    const access = await setLogin(username, password, appName, appVersion, userAgent);
    storeContext.actions.setValue('login:timestamp', access.created);
    setSession(access.appToken);
    appToken.current = access.appToken;

    localStorage.setItem("session", JSON.stringify({
      access: access.appToken,
      timestamp: access.created,
    }));
    return access.created;
  }

  const appAccess = async (token) => {
    if (appToken.current || !checked.current) {
      throw new Error('invalid session state');
    }
    const access = await setAccountAccess(token, appName, appVersion, userAgent);
    storeContext.actions.setValue('login:timestamp', access.created);
    setSession(access.appToken);
    appToken.current = access.appToken;

    localStorage.setItem("session", JSON.stringify({
      access: access.appToken,
      timestamp: access.created,
    }));
    return access.created;
  }

  const appLogout = async (all) => {
    clearSession();
    try {
      await clearLogin(appToken.current, all);
    }
    catch (err) {
      console.log(err);
    }
    appToken.current = null;
    localStorage.removeItem("session");
  };

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
    let protocol;
    if (window.location.protocol === 'http:') {
      protocol = 'ws://';
    }
    else {
      protocol = 'wss://';
    }

    updateState({ status: 'connecting' });
    ws.current = createWebsocket(protocol + window.location.host + "/status?mode=ring");
    ws.current.onmessage = (ev) => {
      try {
        if (ev.data === '') {
          appLogout(false);
          return;
        }
        let activity = JSON.parse(ev.data);
        updateState({ status: 'connected' });
        if (activity.revision) {
          setAppRevision(activity.revision);
        }
        else if (activity.ring) {
          const { cardId, callId, calleeToken, iceUrl, iceUsername, icePassword } = activity.ring;
          ringContext.actions.ring(cardId, callId, calleeToken, iceUrl, iceUsername, icePassword);
        }
        else {
          setAppRevision(activity);
        }
      }
      catch (err) {
        console.log(err);
        ws.current.close();
      }
    }
    ws.current.onclose = (e) => {
      console.log(e)
      updateState({ status: 'disconnected' });
      setTimeout(() => {
        if (ws.current != null) {
          ws.current.onmessage = () => {}
          ws.current.onclose = () => {}
          ws.current.onopen = () => {}
          ws.current.onerror = () => {}
          setWebsocket(token);
        }
      }, 1000);
    }
    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ AppToken: token }))
    }
    ws.current.error = (e) => {
      console.log(e)
      ws.current.close();
    }
  }
 
  const clearWebsocket = ()  => {
    ws.current.onclose = () => {}
    ws.current.close()
    ws.current = null
    updateState({ status: null });
  }

  useEffect(() => {
    const storage = localStorage.getItem('session');
    if (storage != null) {
      try {
        const session = JSON.parse(storage)
        if (session?.access) {
          const access = session.access;
          setSession(access);
          appToken.current = access;
        }
      }
      catch(err) {
        console.log(err)
      }
    }
    checked.current = true;
    // eslint-disable-next-line
  }, []);

  return { state, actions }
}


