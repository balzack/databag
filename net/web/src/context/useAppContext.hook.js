import { useEffect, useState, useRef, useContext } from 'react';
import { getAvailable } from 'api/getAvailable';
import { setLogin } from 'api/setLogin';
import { setAccountAccess } from 'api/setAccountAccess';
import { addAccount } from 'api/addAccount';
import { getUsername } from 'api/getUsername';
import { AccountContext } from './AccountContext';
import { ProfileContext } from './ProfileContext';
import { ArticleContext } from './ArticleContext';
import { GroupContext } from './GroupContext';
import { CardContext } from './CardContext';
import { ChannelContext } from './ChannelContext';
import { StoreContext } from './StoreContext';
import { UploadContext } from './UploadContext';

export function useAppContext() {
  const [state, setState] = useState({});
  const [appRevision, setAppRevision] = useState();

  const delay = useRef(2);
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
  const groupContext = useContext(GroupContext);
  const articleContext = useContext(ArticleContext);

  const resetData = () => {
    revision.current = null;
    accountContext.actions.clearToken();
    profileContext.actions.clearToken();
    articleContext.actions.clearToken();
    groupContext.actions.clearToken();
    cardContext.actions.clearToken();
    channelContext.actions.clearToken();
    setState({});
  }

  const actions = {
    logout: () => {
      appLogout(updateState, clearWebsocket);
      storeContext.actions.clear();
      uploadContext.actions.clear();
      resetData();
    },
    access: async (token) => {
      await appAccess(token, updateState, setWebsocket)
    },
    login: async (username, password) => {
      await appLogin(username, password, updateState, setWebsocket)
    },
    create: async (username, password, token) => {
      await appCreate(username, password, token, updateState, setWebsocket)
    },
    username: getUsername,
    available: getAvailable,
  }

  const appCreate = async (username, password, token) => {
    await addAccount(username, password, token);
    let access = await setLogin(username, password)
    updateState({ access: access.appToken });
    storeContext.actions.setValue('login:timestamp', access.created);
    setWebsocket(access.appToken)
    localStorage.setItem("session", JSON.stringify({
      token: access.appToken,
      timestamp: access.created,
    }));
    return access.created;
  } 

  const appLogin = async (username, password) => {
    let access = await setLogin(username, password)
    updateState({ access: access.appToken });
    storeContext.actions.setValue('login:timestamp', access.created);
    setWebsocket(access.appToken)
    localStorage.setItem("session", JSON.stringify({
      token: access.appToken,
      timestamp: access.created,
    }));
    return access.created;
  }

  const appAccess = async (token) => {
    let access = await setAccountAccess(token)
    updateState({ access });
    setWebsocket(access)
    localStorage.setItem("session", JSON.stringify({ token: access }));
  }

  const appLogout = () => {
    updateState({ access: null });
    clearWebsocket()
    localStorage.removeItem("session");
  }

  useEffect(() => {
    if (appRevision) {
      accountContext.actions.setRevision(appRevision.account);
      profileContext.actions.setRevision(appRevision.profile);
      articleContext.actions.setRevision(appRevision.article);
      groupContext.actions.setRevision(appRevision.group);
      cardContext.actions.setRevision(appRevision.card);
      channelContext.actions.setRevision(appRevision.channel);
    }
  }, [appRevision]);
  
  const setWebsocket = (token) => {

    accountContext.actions.setToken(token);
    profileContext.actions.setToken(token);
    articleContext.actions.setToken(token);
    groupContext.actions.setToken(token);
    cardContext.actions.setToken(token);
    channelContext.actions.setToken(token);

    ws.current = new WebSocket("wss://" + window.location.host + "/status");
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
    const storage = localStorage.getItem('session');
    if (storage != null) {
      try {
        const session = JSON.parse(storage)
        if (session?.token) {
          setState({ token: session.token })
          setWebsocket(session.token);   
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
  }, []);

  if (state == null) {
    return {};
  }
  return { state, actions }
}


