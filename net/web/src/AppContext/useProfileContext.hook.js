import { useEffect, useState, useRef } from 'react';
import { getProfile } from '../Api/getProfile';
import { setProfileData } from '../Api/setProfileData';
import { setProfileImage } from '../Api/setProfileImage';
import { getProfileImageUrl } from '../Api/getProfileImageUrl';

export function useProfileContext() {
  const [state, setState] = useState({
    token: null,
    revision: 0,
    profile: {},
  });
  const next = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const setProfile = async (revision) => {
    if (next.current == null) {
      let profile = await getProfile(state.token);
      updateState({ revision, profile });
      if (next.current != null) {
        let rev = next.current;
        next.current = null;
        setProfile(rev);
      }
    }
    else {
      next.current = revision;
    }
  }

  const actions = {
    setToken: (token) => {
      updateState({ token });
    },
    setRevision: (revision) => {
      setProfile(revision);
    },
    setProfileData: async (name, location, description) => {
      await setProfileData(state.token, name, location, description);
    },
    setProfileImage: async (image) => {
      await setProfileImage(state.token, image);
    },
    profileImageUrl: () => getProfileImageUrl(state.token, state.Data?.profile?.revision),
  }

  return { state, actions }
}


