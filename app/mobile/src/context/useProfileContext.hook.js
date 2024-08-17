import { useState, useRef, useContext } from 'react';
import { getProfile } from '../api/getProfile';
import { setProfileData } from '../api/setProfileData';
import { setProfileImage } from '../api/setProfileImage';
import { getProfileImageUrl } from '../api/getProfileImageUrl';
import { getHandle } from '../api/getHandle';
import { StoreContext } from '../context/StoreContext';

export function useProfileContext() {
  const [state, setState] = useState({
    offsync: false,
    identity: {},
    server: null,
    imageUrl: null,
    monthLast: false,
    timeFull: false,
  });
  const store = useContext(StoreContext);

  const HOUR_KEY = 'hour';
  const DATE_KEY = 'date';

  const access = useRef(null);
  const curRevision = useRef(null);
  const setRevision = useRef(null);
  const syncing = useRef(false);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const sync = async () => {
    if (access.current && !syncing.current && setRevision.current !== curRevision.current) {
      syncing.current = true;

      try {
        const revision = curRevision.current;
        const { server, token, guid } = access.current || {};
        const identity = await getProfile(server, token);
        const imageUrl = identity?.image ? getProfileImageUrl(server, token, revision) : null;
        await store.actions.setProfile(guid, identity);
        await store.actions.setProfileRevision(guid, revision);
        updateState({ offsync: false, identity, imageUrl });
        setRevision.current = revision;
      }
      catch(err) {
        console.log(err);
        updateState({ offsync: true });
        syncing.current = false;
        return;
      }

      syncing.current = false;
      sync();
    }
  };

  const actions = {
    setSession: async (session) => {
      const { guid, server, token } = session || {};
      const identity = await store.actions.getProfile(guid);
      const revision = await store.actions.getProfileRevision(guid);
      const timeFull = (await store.actions.getAppValue(guid, HOUR_KEY)).set == true;
      const monthLast = (await store.actions.getAppValue(guid, DATE_KEY)).set == true;
      const imageUrl = identity?.image ? getProfileImageUrl(server, token, revision) : null;
      updateState({ offsync: false, identity, imageUrl, server, timeFull, monthLast });
      setRevision.current = revision;
      curRevision.current = revision;
      access.current = session;
    },
    clearSession: () => {
      access.current = null;
    },
    setRevision: (rev) => {
      curRevision.current = rev;
      sync();
    },
    setProfileData: async (name, location, description) => {
      const { server, token } = access.current || {};
      await setProfileData(server, token, name, location, description);
    },
    setProfileImage: async (image) => {
      const { server, token } = access.current || {};
      await setProfileImage(server, token, image);
    },
    getHandleStatus: async (name) => {
      const { server, token } = access.current || {};
      return await getHandle(server, token, name);
    },
    setTimeFull: async (flag) => {
      const { guid } = access.current || {};
      await store.actions.setAppValue(guid, HOUR_KEY, { set: flag });
      updateState({ timeFull: flag });
    },
    setMonthLast: async (flag) => {
      const { guid } = access.current || {};
      await store.actions.setAppValue(guid, DATE_KEY, { set: flag });
      updateState({ monthLast: flag });
    },
  }

  return { state, actions }
}


