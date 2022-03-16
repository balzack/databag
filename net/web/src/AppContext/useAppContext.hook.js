import { useEffect, useState, useRef } from 'react';
import { getAvailable, getUsername, setLogin, createAccount } from './fetchUtil';

export default function useAppContext() {
  const [state, setAppState] = useState(null);
  const ws = useRef(null);

  const login = async (username, password) => {
    let access = await setLogin(username, password)
    setAppState({ appToken: access, access: 'user' });
    localStorage.setItem("session", JSON.stringify({ token: access, access: 'user' }));
    connectStatus(access);    
  }

  const create = async (username, password) => {
    await createAccount(username, password);
    try {
      await login(username, password)
    } catch(err) {
      throw new Error("login failed after account createion")
    }
  }

  const logout = () => {
    ws.current.onclose = () => {}
    ws.current.close()
    ws.current = null
    setAppState({ actions: accessActions })
    localStorage.removeItem("session");
  }

  const userActions = {
    logout: logout,
  }

  const adminActions = {
    logout: logout,
  }

  const accessActions = {
    login: login,
    create: create,
    username: getUsername,
    available: getAvailable,
  }

  const connectStatus = (token) => {
    ws.current = new WebSocket("wss://" + window.location.host + "/status");
    ws.current.onmessage = (ev) => {
      console.log(ev)
    }
    ws.current.onclose = () => {
      console.log('ws close')
      setTimeout(() => {
        if (ws.current != null) {
          ws.current.onmessage = () => {}
          ws.current.onclose = () => {}
          ws.current.onopen = () => {}
          ws.current.onerror = () => {}
          connectStatus(token)
        }
      }, 2000)
    }
    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ AppToken: token }))
    }
    ws.current.error = () => {
      console.log('ws error')
    }
  }
 
  useEffect(() => {
    const storage = localStorage.getItem('session');
    if (storage != null) {
      try {
        const session = JSON.parse(storage)
        if (session?.access === 'admin') {
          setAppState({ token: session.token, access: session.access })
          connectStatus(session.token);    
        } else if (session?.access === 'user') {
          setAppState({ token: session.token, access: session.access })
          connectStatus(session.token);    
        } else {
          setAppState({ })
        }
      }
      catch(err) {
        console.log(err)
        setAppState({ actions: accessActions })
      }
    } else {
      setAppState({ actions: accessActions })
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
  return { actions: accessActions }
}


