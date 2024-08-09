import { useState, useContext, useEffect } from 'react'
import { SettingsContext } from '../context/SettingsContext'
import { ContextType } from '../context/ContextType'

export function useAccess() {
  const settings = useContext(SettingsContext) as ContextType
  const [state, setState] = useState({
    display: null,
    strings: settings.state.strings,
    mode: 'login',
    username: '',
    password: '',
    confirm: '',
    theme: '',
    language: '',
    themes: settings.state.themes,
    languages: settings.state.languages,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
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
    setLanguage: (code: string) => {
      settings.actions.setLanguage(code)
    },
    setTheme: (theme: string) => {
      settings.actions.setTheme(theme)
    },
  }

  return { state, actions }
}
