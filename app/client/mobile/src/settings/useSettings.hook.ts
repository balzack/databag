import { useEffect, useState, useContext, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { DisplayContext } from '../context/DisplayContext'
import { ContextType } from '../context/ContextType'

const DEBOUNCE_MS = 1000

export function useSettings() {
  const display = useContext(DisplayContext) as ContextType
  const app = useContext(AppContext) as ContextType
  const debounce = useRef(setTimeout(() => {}, 0))

  const [state, setState] = useState({
    config: {} as Config,
    profile: {} as Profile,
    profileSet: false,
    imageUrl: null,
    strings: display.state.strings,
    all: false,
    password: '',
    confirm: '',
    remove: '',
    username: '',
    taken: false,
    checked: true,
    name: '',
    description: '',
    location: '',
    handle: '',
    secretText: '',
    secretImage: '',
    code: '',
    sealPassword: '',
    sealConfirm: '',
    sealDelete: '',
    secretCopied: false,
    monthFirstDate: true,
    fullDayTime: false,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  const getSession = () => {
    const session = app.state?.session
    const settings = session?.getSettings()
    const identity = session?.getIdentity()
    if (!settings || !identity) {
      console.log('session not set in settings hook')
    }
    return { settings, identity }
  }

  useEffect(() => {
    const { settings, identity } = getSession()
    const setConfig = (config: Config) => {
      updateState({ config })
    }
    settings.addConfigListener(setConfig)
    const setProfile = (profile: Profile) => {
      const { handle, name, location, description } = profile
      const url = identity.getProfileImageUrl()
      updateState({
        profile,
        handle,
        name,
        location,
        description,
        imageUrl: url,
        profileSet: true,
      })
    }
    identity.addProfileListener(setProfile)
    return () => {
      settings.removeConfigListener(setConfig)
      identity.removeProfileListener(setProfile)
    }
  }, [])

  useEffect(() => {
    const { fullDayTime, monthFirstDate } = app.state;
    updateState({ fullDayTime, monthFirstDate });
  }, [app.state.fullDayTime, app.state.monthFirstDate]);

  useEffect(() => {
    const {
      strings,
      dateFormat,
      timeFormat,
    } = display.state
    updateState({
      strings,
      dateFormat,
      timeFormat,
    })
  }, [display.state])

  const actions = {
    getUsernameStatus: async (username: string) => {
      const { settings } = getSession()
      return await settings.getUsernameStatus(username)
    },
    setLogin: async () => {
      const { settings } = getSession()
      await settings.setLogin(state.handle, state.password)
    },
    enableNotifications: async () => {
      const { settings } = getSession()
      await settings.enableNotifications()
    },
    disableNotifications: async () => {
      const { settings } = getSession()
      await settings.disableNotifications()
    },
    enableRegistry: async () => {
      const { settings } = getSession()
      await settings.enableRegistry()
    },
    disableRegistry: async () => {
      const { settings } = getSession()
      await settings.disableRegistry()
    },
    enableMFA: async () => {
      const { settings } = getSession()
      const { secretImage, secretText } = await settings.enableMFA()
      updateState({ secretImage, secretText });
    },
    disableMFA: async () => {
      const { settings } = getSession()
      await settings.disableMFA()
    },
    confirmMFA: async () => {
      const { settings } = getSession()
      await settings.confirmMFA(state.code)
    },
    setCode: (code: string) => {
      updateState({ code });
    },
    copySecret: () => {
      navigator.clipboard.writeText(state.secretText);
      updateState({ secretCopied: true });
      setTimeout(() => {
        updateState({ secretCopied: false });
      }, 1000);
    },
    setSeal: async () => {
      const { settings } = getSession()
      await settings.setSeal(state.sealPassword)
    },
    clearSeal: async () => {
      const { settings } = getSession()
      await settings.clearSeal()
    },
    unlockSeal: async () => {
      const { settings } = getSession()
      await settings.unlockSeal(state.sealPassword)
    },
    forgetSeal: async () => {
      const { settings } = getSession()
      await settings.forgetSeal()
    },
    updateSeal: async () => {
      const { settings } = getSession();
      await settings.updateSeal(state.sealPassword);
    },
    setProfileData: async (
      name: string,
      location: string,
      description: string
    ) => {
      const { identity } = getSession()
      await identity.setProfileData(name, location, description)
    },
    setProfileImage: async (image: string) => {
      const { identity } = getSession()
      await identity.setProfileImage(image)
    },
    getProfileImageUrl: () => {
      const { identity } = getSession()
      return identity.getProfileImageUrl()
    },
    setDateFormat: (format: string) => {
      display.actions.setDateFormat(format)
    },
    setTimeFormat: (format: string) => {
      display.actions.setTimeFormat(format)
    },
    setAll: (all: boolean) => {
      updateState({ all })
    },
    logout: async () => {
      await app.actions.accountLogout(state.all)
    },
    remove: async () => {
      await app.actions.accountRemove()
    },
    setHandle: (handle: string) => {
      updateState({ handle, taken: false, checked: false })
      clearTimeout(debounce.current)
      if (!handle || handle === state.profile.handle) {
        updateState({ available: true, checked: true })
      } else {
        debounce.current = setTimeout(async () => {
          const { settings } = getSession()
          try {
            const available = await settings.getUsernameStatus(handle)
            updateState({ taken: !available, checked: true })
          }
          catch (err) {
            console.log(err);
          }
        }, DEBOUNCE_MS)
      }
    },
    setPassword: (password: string) => {
      updateState({ password })
    },
    setConfirm: (confirm: string) => {
      updateState({ confirm })
    },
    setRemove: (remove: string) => {
      updateState({ remove });
    },
    setName: (name: string) => {
      updateState({ name })
    },
    setLocation: (location: string) => {
      updateState({ location })
    },
    setDescription: (description: string) => {
      updateState({ description })
    },
    setDetails: async () => {
      const { identity } = getSession()
      const { name, location, description } = state
      await identity.setProfileData(name, location, description)
    },
    setSealDelete: (sealDelete: string) => {
      updateState({ sealDelete });
    },
    setSealPassword: (sealPassword: string) => {
      updateState({ sealPassword });
    },
    setSealConfirm: (sealConfirm: string) => {
      updateState({ sealConfirm });
    },
    setFullDayTime: async (flag: boolean) => {
      try {
        await app.actions.setFullDayTime(flag);
      }
      catch (err) {
        console.log(err);
      }
    },
    setMonthFirstDate: async (flag: boolean) => {
      await app.actions.setMonthFirstDate(flag);
    },
  }

  return { state, actions }
}
