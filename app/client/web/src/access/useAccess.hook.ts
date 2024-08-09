import { useState, useContext, useEffect } from 'react'
import { SettingsContext } from '../context/SettingsContext';
import { ContextType } from '../context/ContextType'

export function useAccess() {
  const settings = useContext(SettingsContext) as ContextType
  const [ state, setState ] = useState({
    display: null,
    strings: {},
    mode: 'login',
    username: '',
    password: '',
    theme: '',
    language: '',
    themes: {},
    languages: {},
  })

  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const { display, strings, themes, theme, languages, language } = settings.state;
    updateState({ display, strings, themes: [ ...themes ], theme, languages, language });
  }, [settings.state]);

  const actions = {
    setMode: (mode: string) => {
      updateState({ mode });
    },
    setUsername: (username: string) => {
      updateState({ username });
    },
    setPassword: (password: string) => {
      updateState({ password });
    },
    setLanguage: (code: string) => {
      settings.actions.setLanguage(code);
    },
    setTheme: (theme: string) => {
      settings.actions.setTheme(theme);
    },    
  };

  return { state, actions };  
}

