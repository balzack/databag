import { useEffect, useState, useRef, useContext } from 'react';
import { getAvailable, getUsername, setLogin, createAccount } from './fetchUtil';
import { AccountContext } from './AccountContext';
import { ProfileContext } from './ProfileContext';
import { ArticleContext } from './ArticleContext';
import { GroupContext } from './GroupContext';
import { CardContext } from './CardContext';
import { ChannelContext } from './ChannelContext';

async function appCreate(username, password, updateState, setWebsocket) {
  await createAccount(username, password);
  let access = await setLogin(username, password)
  updateState({ token: access, access: 'user' });
  setWebsocket(access)
  localStorage.setItem("session", JSON.stringify({ token: access, access: 'user' }));
} 

async function appLogin(username, password, updateState, setWebsocket) {
  let access = await setLogin(username, password)
  updateState({ token: access, access: 'user' });
  setWebsocket(access)
  localStorage.setItem("session", JSON.stringify({ token: access, access: 'user' }));
}

function appLogout(updateState, clearWebsocket) {
  updateState({ token: null, access: null });
  clearWebsocket()
  localStorage.removeItem("session");
}

export function useAppContext() {
  const [state, setState] = useState(null);
  const [appRevision, setAppRevision] = useState();

  const delay = useRef(2);
  const ws = useRef(null);
  const revision = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }
  const updateData = (value) => {
    setState((s) => {
      let data = { ...s.Data, ...value }
      return { ...s, Data: data }
    })
  }

  const accountContext = useContext(AccountContext);
  const profileContext = useContext(ProfileContext);
  const channelContext = useContext(ChannelContext);
  const cardContext = useContext(CardContext);
  const groupContext = useContext(GroupContext);
  const articleContext = useContext(ArticleContext);

  const resetData = () => {
    revision.current = null;
    setState({});
  }

  const userActions = {
    logout: () => {
      appLogout(updateState, clearWebsocket);
      resetData();
    },
  }

  const adminActions = {
    logout: () => {
      appLogout(updateState, clearWebsocket);
      resetData();
    }
  }

  const accessActions = {
    login: async (username, password) => {
      await appLogin(username, password, updateState, setWebsocket)
    },
    create: async (username, password) => {
      await appCreate(username, password, updateState, setWebsocket)
    },
    username: getUsername,
    available: getAvailable,
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
      }
      catch (err) {
        console.log(err);
      }
    }
    ws.current.onclose = (e) => {
      console.log(e)
      setTimeout(() => {
        if (ws.current != null) {
          ws.current.onmessage = () => {}
          ws.current.onclose = () => {}
          ws.current.onopen = () => {}
          ws.current.onerror = () => {}
          setWebsocket(token);
          delay.current += 1;
        }
      }, delay.current * 1000)
    }
    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ AppToken: token }))
    }
    ws.current.error = (e) => {
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
        if (session?.access === 'admin') {
          setState({ token: session.token, access: session.access })
        } else if (session?.access === 'user') {
          setState({ token: session.token, access: session.access })
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

  if (!state) {
    return {}
  }
  if (state.access === 'user') {
    return { state, actions: userActions }
  }
  if (state.access === 'admin') {
    return { state, actions: adminActions }
  }
  return { state, actions: accessActions }
}


