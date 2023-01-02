import { useState, useRef } from 'react';
import { getProfile } from 'api/getProfile';
import { setProfileData } from 'api/setProfileData';
import { setProfileImage } from 'api/setProfileImage';
import { getProfileImageUrl } from 'api/getProfileImageUrl';

export function useProfileContext() {
  const [state, setState] = useState({
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
    if (!syncing.current) {
      if (setRevision.current !== curRevision.current) {
        syncing.current = true;
        const revision = curRevision.current;

        try {
          const identity = await getProfile(access.current);
          const imageUrl = identity.image ? getProfileImageUrl(access.current, revision) : null;
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
    }
  }

  const actions = {
    setToken: (token) => {
      access.current = token;
    },
    clearToken: () => {
      access.current = null;
      curRevision.current = null;
      setRevision.current = null;
      setState({ identity: {}, imageUrl: null });
    },
    setRevision: (rev) => {
      curRevision.current = rev;
      sync();
    },
    setProfileData: async (name, location, description) => {
      await setProfileData(access.current, name, location, description);
    },
    setProfileImage: async (image) => {
      await setProfileImage(access.current, image);
    },
  }

  return { state, actions }
}


