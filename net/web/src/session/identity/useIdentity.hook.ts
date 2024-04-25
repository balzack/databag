import { useState, useEffect, useContext } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { AppContext } from 'context/AppContext';
import { SettingsContext } from 'context/SettingsContext';

export function useIdentity() {
  const [state, setState] = useState({
    url: null,
    name: null,
    handle: null,
    status: null,
    init: false,
    strings: {} as Record<string, string>,
    colors: {},
    menuStyle: {},
  });

  const app = useContext(AppContext);
  const profile = useContext(ProfileContext);
  const settings = useContext(SettingsContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  };

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

  useEffect(() => {
    const { colors, strings, menuStyle } = settings.state;
    updateState({ colors, strings, menuStyle });
  }, [settings.state]);

  const actions = {
    logout: (all) => {
      app.actions.logout(all);
    },
  };

  return { state, actions };
}
