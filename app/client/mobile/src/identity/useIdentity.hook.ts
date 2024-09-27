import {useEffect, useState, useContext} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';

export function useIdentity() {
  const display = useContext(DisplayContext) as ContextType;
  const app = useContext(AppContext) as ContextType;

  const [state, setState] = useState({
    all: false,
    profile: {} as Profile,
    profileSet: false,
    imageUrl: null,
    strings: display.state.strings,
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const identity = app.state.session?.getIdentity();
    if (!identity) {
      console.log('session not set in identity hook');
    } else {
      const setProfile = (profile: Profile) => {
        updateState({
          profile,
          profileSet: true,
          imageUrl: {uri: identity.getProfileImageUrl()},
        });
      };
      identity.addProfileListener(setProfile);
      return () => {
        identity.removeProfileListener(setProfile);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actions = {
    setAll: all => {
      updateState({all});
    },
    logout: async () => {
      await app.actions.accountLogout(state.all);
    },
  };

  return {state, actions};
}
