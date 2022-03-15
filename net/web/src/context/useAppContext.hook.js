import { useEffect, useState, useRef } from 'react';
import { getAvailable, getUsername, setLogin, createAccount } from './fetchUtil';

export default function useAppContext() {
  const [state, setState] = useState(null);
  const ws = useRef(null);

  const login = async (username: string, password: string) => {
    let access = await setLogin(username, password)
    setState({ appToken: access, access: 'user', actions: userActions });
    localStorage.setItem("session", JSON.stringify({ token: access, access: 'user' }));
    connectStatus(access);    
  }

  const create = async (username: string, password: string) => {
    await createAccount(username, password);
    try {
      await login(username, password)
    } catch(err) {
      throw new Error("login failed after account createion")
    }
  }

  const logout = () => {
    ws.current.onclose = () => {}
    ws.current.close(1000, "bye")
    ws.current = null
    setState({ actions: accessActions })
    localStorage.removeItem("session");
  }

  const userActions = {
    setListener: setListener,
    clearListener: clearListener,
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

  const connectStatus = (token: string) => {
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
          setState({ appToken: session.token, access: session.access, actions: adminActions })
          connectStatus(session.token);    
        } else if (session?.access === 'user') {
          setState({ appToken: session.token, access: session.access, actions: userActions })
          connectStatus(session.token);    
        } else {
          setState({ actions: accessActions })
        }
      }
      catch(err) {
        console.log(err)
        setState({ actions: accessActions })
      }
    } else {
      setState({ actions: accessActions })
    }
  }, []);

  return state;
}

function setListener(name: string, callback: (objectId: string) => void) {
  return
}

function clearListener(callback: (objectId: string) => void) {
  return
}


