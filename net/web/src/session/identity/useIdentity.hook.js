import { useState, useEffect, useContext } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { AppContext } from 'context/AppContext';

export function useIdentity() {

  const [state, setState] = useState({
    url: null,
    name: null,
    handle: null,
    status: null,
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
  }, [profile.state]);

  useEffect(() => {
    const { status } = app.state;
    updateState({ status });
  }, [app.state]);

  const actions = {
    logout: (all) => {
      app.actions.logout(all);
    },
  };

  return { state, actions };
}

