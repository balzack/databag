import { useState, useRef } from 'react';
import { getUsername } from 'api/getUsername';
import { getProfile } from 'api/getProfile';
import { setProfileData } from 'api/setProfileData';
import { setProfileImage } from 'api/setProfileImage';
import { getProfileImageUrl } from 'api/getProfileImageUrl';

export function useProfileContext() {
  const [state, setState] = useState({
    offsync: false,
    identity: {},
    imageUrl: null,
  });
  const access = useRef(null);
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
        const token = access.current;
        const revision = curRevision.current;
        const identity = await getProfile(access.current);
        const imageUrl = identity.image ? getProfileImageUrl(token, identity.revision) : null;
        setRevision.current = revision;
        updateState({ offsync: false, identity, imageUrl });
      }
      catch(err) {
        console.log(err);
        syncing.current = false;
        updateState({ offsync: true });
        return;
      }

      syncing.current = false;
      await sync();
    }
  }

  const actions = {
    setToken: (token) => {
      if (access.current || syncing.current) {
        throw new Error("invalid profile session state");
      }
      access.current = token;
      curRevision.current = null;
      setRevision.current = null;
      setState({ offsync: false, identity: {}, imageUrl: null });
    },
    clearToken: () => {
      access.current = null;
    },
    setRevision: async (rev) => {
      curRevision.current = rev;
      await sync();
    },
    setProfileData: async (name, location, description) => {
      await setProfileData(access.current, name, location, description);
    },
    setProfileImage: async (image) => {
      await setProfileImage(access.current, image);
    },
    getHandleStatus: async (name) => {
      return await getUsername(name, access.current);
    },
    resync: async () => {
      await sync();
    },
  }

  return { state, actions }
}


