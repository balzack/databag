import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { DisplayContext } from '../context/DisplayContext';
import { ContextType } from '../context/ContextType'
import { Profile } from 'databag-client-sdk';

export function useRegistry() {
  const app = useContext(AppContext) as ContextType
  const display = useContext(DisplayContext) as ContextType
  const [state, setState] = useState({
    strings: display.state.strings,
    username: '',
    server: '',
    profiles: [] as Profile[],
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  const getRegistry = async () => {
    const contact = app.state.session?.getContact();
    const profiles = await contact.getRegistry(null, null);
    updateState({ profiles });
  }

  useEffect(() => {
    getRegistry();
  }, [])

  const actions = {
    setUsername: (username: string) => {
      updateState({ username });
    },
    setServer: (server: string) => {
      updateState({ server });
    },
  }

  return { state, actions }
}
