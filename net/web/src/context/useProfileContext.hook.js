import { useEffect, useState, useRef } from 'react';
import { getProfile } from 'api/getProfile';
import { setProfileData } from 'api/setProfileData';
import { setProfileImage } from 'api/setProfileImage';
import { getProfileImageUrl } from 'api/getProfileImageUrl';

export function useProfileContext() {
  const [state, setState] = useState({
    init: false,
    profile: {},
  });
  const access = useRef(null);
  const revision = useRef(null);
  const next = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const setProfile = async (rev) => {
    if (next.current == null) {
      if (revision.current != rev) {
        let profile = await getProfile(access.current);
        updateState({ init: true, profile });
        revision.current = rev;
      }
      if (next.current != null) {
        let r = next.current;
        next.current = null;
        setProfile(r);
      }
    }
    else {
      next.current = rev;
    }
  }

  const actions = {
    setToken: (token) => {
      access.current = token;
    },
    clearToken: () => {
      access.current = null;
      revision.current = null;
      setState({ init: false, profile: {} });
    },
    setRevision: (rev) => {
      setProfile(rev);
    },
    setProfileData: async (name, location, description) => {
      await setProfileData(access.current, name, location, description);
    },
    setProfileImage: async (image) => {
      await setProfileImage(access.current, image);
    },
    getProfile: () => {
      const { name, handle, image, revision } = state.profile;
      if (image == null || image == '') {
        return { name, handle };
      }
      return { name, handle, imageUrl: getProfileImageUrl(access.current, revision) };
    },
    profileImageUrl: () => getProfileImageUrl(access.current, revision.current),
  }

  return { state, actions }
}


