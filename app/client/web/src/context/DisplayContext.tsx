import React, { ReactNode, createContext } from 'react'
import { useDisplayContext } from './useDisplayContext.hook'

export const DisplayContext = createContext({})

export function DisplayContextProvider({ children }: { children: ReactNode }) {
  const { state, actions } = useDisplayContext()
  return (
    <DisplayContext.Provider value={{ state, actions }}>
      {children}
    </DisplayContext.Provider>
  )
}
