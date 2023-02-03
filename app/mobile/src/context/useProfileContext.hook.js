import { useState, useRef, useContext } from 'react';
import { getProfile } from 'api/getProfile';
import { setProfileData } from 'api/setProfileData';
import { setProfileImage } from 'api/setProfileImage';
import { getProfileImageUrl } from 'api/getProfileImageUrl';
import { getHandle } from 'api/getHandle';
import { StoreContext } from 'context/StoreContext';

export function useProfileContext() {
  const [state, setState] = useState({
    identity: {},
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
        const { server, token, guid } = session.current;
        const identity = await getProfile(server, token);
        const imageUrl = identity?.image ? getProfileImageUrl(server, token, revision) : null;
        await store.actions.setProfile(guid, identity);
        await store.actions.setProfileRevision(guid, revision);
        updateState({ identity, imageUrl });
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
      const { guid, server, token } = access;
      const identity = await store.actions.getProfile(guid);
      const revision = await store.actions.getProfileRevision(guid);
      const imageUrl = identity?.image ? getProfileImageUrl(server, token, revision) : null;
      updateState({ identity, imageUrl });
      setRevision.current = revision;
      curRevision.current = revision;
      session.current = access;
    },
    clearSession: () => {
      session.current = {};
      updateState({ identity: {}, imageUrl: null });
    },
    setRevision: (rev) => {
      curRevision.current = rev;
      sync();
    },
    setProfileData: async (name, location, description) => {
      const { server, token } = session.current;
      await setProfileData(server, token, name, location, description);
    },
    setProfileImage: async (image) => {
      const { server, token } = session.current;
      await setProfileImage(server, token, image);
    },
    getHandleStatus: async (name) => {
      const { server, token } = session.current;
      return await getHandle(server, token, name);
    },
  }

  return { state, actions }
}


