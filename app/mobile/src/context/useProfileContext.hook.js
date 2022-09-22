import { useState, useRef, useContext } from 'react';
import { getProfile } from 'api/getProfile';
import { setProfileData } from 'api/setProfileData';
import { setProfileImage } from 'api/setProfileImage';
import { getProfileImageUrl } from 'api/getProfileImageUrl';
import { getHandle } from 'api/getHandle';
import { StoreContext } from 'context/StoreContext';

export function useProfileContext() {
  const [state, setState] = useState({
    profile: {},
    imageUrl: null,
  });
  const store = useContext(StoreContext);

  const session = useRef(null);
  const curRevision = useRef(null);
  const setRevision = useRef(null);
  const syncing = useRef(false);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const sync = async () => {
    if (!syncing.current && setRevision.current !== curRevision.current) {
      syncing.current = true;

      try {
        const revision = curRevision.current;
        const { server, appToken, guid } = session.current;
        const profile = await getProfile(server, appToken);
        await store.actions.setProfile(guid, profile);
        await store.actions.setProfileRevision(guid, revision);
        updateState({ profile, imageUrl: getProfileImageUrl(server, appToken, revision) });
        setRevision.current = revision;
      }
      catch(err) {
        console.log(err);
        syncing.current = false;
        return;
      }

      syncing.current = false;
      sync();
    }
  };

  const actions = {
    setSession: async (access) => {
      const { guid, server, appToken } = access;
      const profile = await store.actions.getProfile(guid);
      const revision = await store.actions.getProfileRevision(guid);
      updateState({ profile, imageUrl: getProfileImageUrl(server, appToken, revision) });
      setRevision.current = revision;
      curRevision.current = revision;
      session.current = access;
    },
    clearSession: () => {
      session.current = {};
      updateState({ profile: null });
    },
    setRevision: (rev) => {
      curRevision.current = rev;
      sync();
    },
    setProfileData: async (name, location, description) => {
      const { server, appToken } = session.current;
      await setProfileData(server, appToken, name, location, description);
    },
    setProfileImage: async (image) => {
      const { server, appToken } = session.current;
      await setProfileImage(server, appToken, image);
    },
    getHandle: async (name) => {
      const { server, appToken } = session.current;
      return await getHandle(server, appToken, name);
    },
  }

  return { state, actions }
}


