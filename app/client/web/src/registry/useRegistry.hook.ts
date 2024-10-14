import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { DisplayContext } from '../context/DisplayContext';
import { ContextType } from '../context/ContextType'

export function useRegistry() {
  const app = useContext(AppContext) as ContextType
  const display = useContext(DisplayContext) as ContextType
  const [state, setState] = useState({
    strings: display.state.strings,
    username: '',
    server: '',
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  const actions = {
    setUsername: (username) => {
      updateState({ username });
    },
    setServer: (server) => {
      updateState({ server });
    },
  }

  return { state, actions }
}
