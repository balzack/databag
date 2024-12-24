import { useEffect, useState, useContext, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { DisplayContext } from '../context/DisplayContext'
import { ContextType } from '../context/ContextType'
import { type Profile, type Config } from 'databag-client-sdk'
import { Point, Area } from 'react-easy-crop/types'

const IMAGE_DIM = 192
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
    clip: { width: 0, height: 0, x: 0, y: 0 },
    crop: { x: 0, y: 0 },
    zoom: 1,
    secretText: '',
    secretImage: '',
    code: '',
    editImage: '',
    sealPassword: '',
    sealConfirm: '',
    sealDelete: '',
    secretCopied: false,
    blockedCards: [] as {cardId: string}[],
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
        editImage: url,
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
    const { strings, dateFormat, timeFormat, themes, scheme, languages, language, audioId, audioInputs, videoId, videoInputs } = display.state
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
  }, [display.state])

  const actions = {
    loadBlockedCards: async () => {
      const settings = app.state.session.getSettings(); 
      const blockedCards = await settings.getBlockedCards();
      updateState({ blockedCards });
    },
    unblockCard: async (cardId: string) => {
      const contact = app.state.session.getContact();
      await contact.setBlockedCard(cardId, false);
      const blockedCards = state.blockedCards.filter(blocked => blocked.cardId != cardId);
      updateState({ blockedCards });
    },
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
      updateState({ secretImage, secretText })
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
      updateState({ code })
    },
    copySecret: () => {
      navigator.clipboard.writeText(state.secretText)
      updateState({ secretCopied: true })
      setTimeout(() => {
        updateState({ secretCopied: false })
      }, 1000)
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
      const { settings } = getSession()
      await settings.updateSeal(state.sealPassword)
    },
    setProfileData: async (name: string, location: string, description: string) => {
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
    setLanguage: (code: string) => {
      display.actions.setLanguage(code)
    },
    setTheme: (theme: string) => {
      display.actions.setTheme(theme)
    },
    setVideo: (device: string | null) => {
      display.actions.setVideoInput(device ? device : null)
    },
    setAudio: (device: string | null) => {
      display.actions.setAudioInput(device ? device : null)
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
    setHandle: (handle: string) => {
      updateState({ handle, taken: false, checked: false })
      clearTimeout(debounce.current)
      if (!handle || handle === state.profile.handle) {
        updateState({ available: true, checked: true })
      } else {
        debounce.current = setTimeout(async () => {
          const { settings } = getSession()
          const available = await settings.getUsernameStatus(handle)
          updateState({ taken: !available, checked: true })
        }, DEBOUNCE_MS)
      }
    },
    setPassword: (password: string) => {
      updateState({ password })
    },
    setConfirm: (confirm: string) => {
      updateState({ confirm })
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
    setCrop: (crop: Point) => {
      updateState({ crop })
    },
    setZoom: (zoom: number) => {
      updateState({ zoom })
    },
    setEditImageCrop: (clip: Area) => {
      updateState({ clip })
    },
    setEditImage: (editImage: string) => {
      updateState({ editImage })
    },
    setSealDelete: (sealDelete: string) => {
      updateState({ sealDelete })
    },
    setSealPassword: (sealPassword: string) => {
      updateState({ sealPassword })
    },
    setSealConfirm: (sealConfirm: string) => {
      updateState({ sealConfirm })
    },
    setImage: async () => {
      const { identity } = getSession()
      const processImg = () => {
        return new Promise<string>((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas')
              const context = canvas.getContext('2d')
              if (!context) {
                throw new Error('failed to allocate context')
              }
              canvas.width = IMAGE_DIM
              canvas.height = IMAGE_DIM
              context.imageSmoothingQuality = 'medium'
              context.drawImage(img, state.clip.x, state.clip.y, state.clip.width, state.clip.height, 0, 0, IMAGE_DIM, IMAGE_DIM)
              resolve(canvas.toDataURL())
            } catch (err) {
              console.log(err)
              reject()
            }
          }
          if (!state.editImage) {
            throw new Error('invalid edit image')
          }
          img.onerror = reject
          img.src = state.editImage
        })
      }
      const dataUrl = await processImg()
      const data = dataUrl.split(',')[1]
      await identity.setProfileImage(data)
    },
  }

  return { state, actions }
}
