import { useState, useEffect, useContext } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { AppContext } from 'context/AppContext';
import { ViewportContext } from 'context/ViewportContext';

export function useProfile() {
  
  const [state, setState] = useState({
    init: false,
  });

  const app = useContext(AppContext);
  const viewport = useContext(ViewportContext);
  const profile = useContext(ProfileContext);
  
  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (profile.state.init) {
      const { node, name, handle, location, description, image } = profile.state.profile;
      let url = !image ? null : profile.actions.profileImageUrl();
      updateState({ init: true, name, node, handle, url, location, description });
    }
  }, [profile]);

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  const actions = {
    logout: app.actions.logout,
  };

  return { state, actions };
}

