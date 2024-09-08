import { useEffect, useState, useContext, useRef } from 'react'
import { AppContext } from '../context/AppContext';
import { DisplayContext } from '../context/DisplayContext';
import { ContextType } from '../context/ContextType';
import { Session, Settings, Identity, type Profile, type Config } from 'databag-client-sdk'

const DEBOUNCE_MS = 1000;

export function useSettings() {

  const display = useContext(DisplayContext) as ContextType;
  const app = useContext(AppContext) as ContextType;
  const debounce = useRef(useRef(setTimeout(() => {}, 0)));

  const [state, setState] = useState({
    config: {} as Config,
    profile: {} as Profile,
    profileSet: false,
    imageUrl: null,
    strings: display.state.strings,
    scheme: '',
    language: '',
    themes: display.state.themes,
    languages: display.state.languages,
    audioId: null,
    audioInputs: [],
    videoId: null,
    videoInputs: [],
    timeFormat: '12h',
    dateFormat: 'mm/dd',
    all: false,
    password: '',
    confirm: '',
    username: '',
    taken: false,
    checked: true,
    name: '',
    description: '',
    location: '',
    handle: '',
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
      const { handle, name, location, description } = profile;
      updateState({ profile, handle, name, location, description, profileSet: true, imageUrl: identity.getProfileImageUrl() }) 
    }
    identity.addProfileListener(setProfile)
    return () => { 
      settings.removeConfigListener(setConfig);
      identity.removeProfileListener(setProfile);
    }
  }, []);

  useEffect(() => {
    const { strings, dateFormat, timeFormat, themes, scheme, languages, language, audioId, audioInputs, videoId, videoInputs } =
      display.state
    updateState({
      strings,
      dateFormat,
      timeFormat,
      themes: [...themes],
      scheme,
      languages,
      language,
      audioId,
      audioInputs,
      videoId,
      videoInputs,
    })

console.log(audioInputs, videoInputs);
  }, [display.state])

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
    setLanguage: (code: string) => {
      display.actions.setLanguage(code)
    },
    setTheme: (theme: string) => {
      display.actions.setTheme(theme)
    },
    setVideo: (device: string | null) => {
      display.actions.setVideoInput(device ? device : null);
    },
    setAudio: (device: string | null) => {
      display.actions.setAudioInput(device ? device : null);
    },
    setDateFormat: (format: string) => {
      display.actions.setDateFormat(format);
    },
    setTimeFormat: (format: string) => {
      display.actions.setTimeFormat(format);
    },
    setAll: (all: boolean) => {
      updateState({ all });
    },
    logout: async () => {
      await app.actions.accountLogout(state.all);
    },
    setHandle: (handle) => {
      updateState({ handle, taken: false, checked: false });
      clearTimeout(debounce.current);
      if (!handle || handle === state.profile.handle) {
        updateState({ available: true, checked: true});
      }
      else {
        debounce.current = setTimeout(async () => {
          const { settings } = getSession();
          const available = await settings.getUsernameStatus(handle);
          updateState({ taken: !available, checked: true });
        }, DEBOUNCE_MS);
      }
    },
    setPassword: (password) => {
      updateState({ password });
    },
    setConfirm: (confirm) => {
      updateState({ confirm });
    },
    setLogin: async () => {
      const { settings } = getSession();
      await settings.setLogin(state.username, state.password);
    },
    setName: (name) => {
      updateState({ name });
    },
    setLocation: (location) => {
      updateState({ location });
    },
    setDescription: (description) => {
      updateState({ description });
    },
    setDetails: async () => {
      const { identity } = getSession();
      const { name, location, description } = state;
      await identity.setProfileData(name, location, description);
    }
  }

  return { state, actions }
}
