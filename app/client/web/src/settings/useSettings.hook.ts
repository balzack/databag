import { useEffect, useState, useContext } from 'react'
import { AppContext } from '../context/AppContext';
import { DisplayContext } from '../context/DisplayContext';
import { ContextType } from '../context/ContextType';
import { Session, Settings, Identity, type Profile, type Config } from 'databag-client-sdk'

export function useSettings() {

  const display = useContext(DisplayContext) as ContextType;
  const app = useContext(AppContext) as ContextType;

  const [state, setState] = useState({
    config: {},
    profile: {},
    imageUrl: null,
    strings: display.state.strings,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  const getSession = () => {
    const session = app.state?.session;
    const settings = session?.getSettings();
    const identity = session?.getIdentity();
    if (!settings || !identity) {
      console.log('session not set in settings hook');
    }
    return { settings, identity }
  }

  useEffect(() => {
    const { settings, identity } = getSession()
    const setConfig = (config: Config) => {
      updateState({ config }) 
    }
    settings.addConfigListener(setConfig);
    const setProfile = (profile: Profile) => {
      updateState({ profile, imageUrl: identity.getProfileImageUrl() }) 
    }
    identity.addProfileListener(setProfile)
    return () => { 
      settings.removeConfigListener(setConfig);
      identity.removeProfileListener(setProfile);
    }
  }, []);

  const actions = {
    getUsernameStatus: async (username: string) => {
      const { settings } = getSession();
      return await settings.getUsernameStatus(username);
    },
    setLogin: async (username: string, password: string) => {
      const { settings } = getSession();
      await settings.setLogin(username, password);
    },
    enableNotifications: async () => {
      const { settings } = getSession();
      await settings.enableNotifications();
    },
    disableNotifications: async () => {
      const { settings } = getSession();
      await settings.disableNotifications();
    },
    enableRegistry: async () => {
      const { settings } = getSession();
      await settings.enableRegistry();
    },
    disableRegistry: async () => {
      const { settings } = getSession();
      await settings.disableRegistry();
    },
    enableMFA: async () => {
      const { settings } = getSession();
      return await settings.enableMFA();
    },
    disableMFA: async () => {
      const { settings } = getSession();
      await settings.disableMFA();
    },
    confirmMFA: async (code: string) => {
      const { settings } = getSession();
      await settings.confirmMFA(code);
    },
    setSeal: async (password: string) => {
      const { settings } = getSession();
      await settings.setSeal(password);
    },
    clearSeal: async () => {
      const { settings } = getSession();
      await settings.clearSeal();
    },
    unlockSeal: async (password: string) => {
      const { settings } = getSession();
      await settings.unlockSeal(password);
    },
    forgetSeal: async () => {
      const { settings } = getSession();
      await settings.forgetSeal();
    },
    setProfileData: async (name: string, location: string, description: string) => {
      const { identity } = getSession();
      await identity.setProfileData(name, location, description);
    },
    setProfileImage: async (image: string) => {
      const { identity } = getSession();
      await identity.setProfileImage(image);
    },
    getProfileImageUrl: () => {
      const { identity } = getSession();
      return identity.getProfileImageUrl();
    },
  }

  return { state, actions }
}
