import React, { useContext } from 'react'
import { SettingsContext } from '../context/SettingsContext'
import { ContextType } from '../context/ContextType'

export function Root () {
  const settings = useContext(SettingsContext) as ContextType;

  return <div>{ settings.state.display }</div>
}
