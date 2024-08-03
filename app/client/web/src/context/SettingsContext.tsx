import React, { ReactNode, createContext } from 'react'
import { useSettingsContext } from './useSettingsContext.hook'

export const SettingsContext = createContext({})

export function SettingsContextProvider({ children }: { children: ReactNode }) {
  const { state, actions } = useSettingsContext()
  return (
    <SettingsContext.Provider value={{ state, actions }}>
      {children}
    </SettingsContext.Provider>
  )
}
