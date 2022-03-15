import { useEffect, useState } from 'react';

export default function useAppContext() {
  const [state, setState] = useState(null);

  const actions = {
    setListener: setListener,
    clearListener: clearListener,
    login: login,
    logout: logout,
  }
      
  useEffect(() => {
    const token = localStorage.getItem('app_token');
    if (token) {
      setState({ appToken: token })
    } else {
      setState({ appToken: null })
    }
  }, []);
  return { state, actions };
}

function setListener(name: string, callback: (objectId: string) => void) {
  return
}

function clearListener(callback: (objectId: string) => void) {
  return
}

async function login(username: string, password: string) {
  return
}

async function logout() {
  return
}

