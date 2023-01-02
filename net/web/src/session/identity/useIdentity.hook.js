import { useState, useEffect, useContext } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { AppContext } from 'context/AppContext';

export function useIdentity() {

  const [state, setState] = useState({
    url: null,
    name: null,
    handle: null,
    disconnected: false,
    init: false,
  });

  const app = useContext(AppContext);
  const profile = useContext(ProfileContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (profile.state.identity?.guid) {
      const { name, handle, image } = profile.state.identity;
      let url = !image ? null : profile.state.imageUrl;
      updateState({ init: true, name, handle, url });
    }
  }, [profile]);

  useEffect(() => {
    if (app.state) {
      updateState({ disconnected: app.state.disconnected });
    }
  }, [app]);

  const actions = {
    logout: app.actions.logout,
  };

  return { state, actions };
}

