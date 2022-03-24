import { useEffect, useState, useRef } from 'react';
import { setProfileImage, setProfileData, getProfileImageUrl, getProfile, getGroups, getAvailable, getUsername, setLogin, createAccount } from './fetchUtil';

async function updateProfile(token, updateData) {
  let profile = await getProfile(token);
  updateData({ profile: profile })
}

async function updateGroups(token, revision, groupMap, updateData) {
  let groups = await getGroups(token, revision);
  for (let group of groups) {
    groupMap.set(group.id, group);
  }
  updateData({ groups: Array.from(groupMap.values()) });
}

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

  const groupRevision = useRef(null);
  const groups = useRef(new Map());

  const profileRevision = useRef(null);
  const profile = useRef({});

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

  const resetData = () => {
    revision.current = null;
    profile.current = {};
    profileRevision.current = null;
    groups.current = new Map();
    groupRevision.current = null;
  }

  const userActions = {
    logout: () => {
      appLogout(updateState, clearWebsocket);
      resetData();
    },
    setProfileData: async (name, location, description) => {
      await setProfileData(state.token, name, location, description);
    },
    setProfileImage: async (image) => {
      await setProfileImage(state.token, image);
    },
    profileImageUrl: () => getProfileImageUrl(state.token, state.Data?.profile?.revision)
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

  const processRevision = async (token) => {
    while(revision.current != null) {
      let rev = revision.current;

      // update group if revision changed
      if (rev.group != groupRevision.current) {
        await updateGroups(token, groupRevision.current, groups.current, updateData);
        groupRevision.current = rev.group
      }

      // update profile if revision changed
      if (rev.profile != profileRevision.current) {
        await updateProfile(token, updateData) 
        profileRevision.current = rev.profile
      }

      // check if new revision was received during processing
      if (rev == revision.current) {
        revision.current = null
      }
    }
  }

  const setWebsocket = (token) => {
    ws.current = new WebSocket("wss://" + window.location.host + "/status");
    ws.current.onmessage = (ev) => {
      if (revision.current != null) {
        revision.current = JSON.parse(ev.data);
      }
      else {
        revision.current = JSON.parse(ev.data);
        processRevision(token)
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
        }
      }, 2000)
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
          setWebsocket(session.token);
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
  return { actions: accessActions }
}


