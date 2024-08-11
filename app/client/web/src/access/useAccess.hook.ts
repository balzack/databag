import { useRef, useState, useContext, useEffect } from 'react'
import { SettingsContext } from '../context/SettingsContext'
import { AppContext } from '../context/AppContext'
import { ContextType } from '../context/ContextType'

export function useAccess() {
  const debounce = useRef(setTimeout(() => {}, 0))
  const app = useContext(AppContext) as ContextType
  const settings = useContext(SettingsContext) as ContextType
  const [state, setState] = useState({
    display: null,
    strings: settings.state.strings,
    mode: 'login',
    username: '',
    password: '',
    confirm: '',
    token: '',
    theme: '',
    language: '',
    node: '',
    secure: false,
    host: '',
    available: 0,
    availableSet: false,
    themes: settings.state.themes,
    languages: settings.state.languages,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const { protocol, host } = location
    setUrl(`${protocol}//${host}`)
  }, [])

  const setUrl = (node: string) => {
    try {
      const url = new URL(node)
      const { protocol, host } = url
      getAvailable(host, protocol === 'https:')
      updateState({ node, host, secure: protocol === 'https:' })
    } catch (err) {
      console.log(err)
      const { protocol, host } = location
      getAvailable(host, protocol === 'https:')
      updateState({ node, host, secure: protocol === 'https:' })
    }
  }

  const getAvailable = (node: string, secure: boolean) => {
    updateState({ availableSet: false })
    clearTimeout(debounce.current)
    debounce.current = setTimeout(async () => {
      try {
        const available = await app.actions.getAvailable(node, secure)
        updateState({ available, availableSet: true })
      } catch (err) {
        console.log(err)
      }
    }, 1000)
  }

  useEffect(() => {
    const { display, strings, themes, theme, languages, language } =
      settings.state
    updateState({
      display,
      strings,
      themes: [...themes],
      theme,
      languages,
      language,
    })
  }, [settings.state])

  const actions = {
    setMode: (mode: string) => {
      updateState({ mode })
    },
    setUsername: (username: string) => {
      updateState({ username })
    },
    setPassword: (password: string) => {
      updateState({ password })
    },
    setConfirm: (confirm: string) => {
      updateState({ confirm })
    },
    setToken: (token: string) => {
      updateState({ token })
    },
    setNode: (node: string) => {
      setUrl(node)
    },
    setLanguage: (code: string) => {
      settings.actions.setLanguage(code)
    },
    setTheme: (theme: string) => {
      settings.actions.setTheme(theme)
    },
    accountLogin: async () => {
      const { username, password, host, secure } = state
      await app.actions.accountLogin(username, password, host, secure)
    },
  }

  return { state, actions }
}
