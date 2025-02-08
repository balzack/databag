import { useState, useContext, useEffect, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { DisplayContext } from '../context/DisplayContext'
import { ContextType } from '../context/ContextType'
import { Profile } from 'databag-client-sdk'

export function useRegistry() {
  const updating = useRef(false)
  const update = useRef(null as { username: string; server: string } | null)
  const debounce = useRef(setTimeout(() => {}, 0))
  const app = useContext(AppContext) as ContextType
  const display = useContext(DisplayContext) as ContextType
  const [state, setState] = useState({
    strings: display.state.strings,
    username: '',
    server: '',
    profiles: [] as Profile[],
    contacts: [] as Profile[],
    guid: '',
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  const getRegistry = async (username: string, server: string) => {
    update.current = { username, server }
    if (!updating.current) {
      while (update.current != null) {
        updating.current = true
        const params = update.current
        update.current = null
        try {
          const contact = app.state.session?.getContact()
          const username = params.username ? params.username : null
          const server = params.server ? params.server : null
          const profiles = await contact.getRegistry(username, server)
          updateState({ profiles })
        } catch (err) {
          console.log(err)
          updateState({ profiles: [] })
        }
        updating.current = false
      }
    }
  }
  useEffect(() => {
    updateState({ contacts: state.profiles.filter((profile: Profile) => profile.guid !== state.guid) });
  }, [state.profiles, state.guid]);

  useEffect(() => {
    const identity = app.state?.session?.getIdentity();
    const setProfile = (profile: Profile) => {
      const {guid} = profile;
      updateState({ guid });
    };
    if (identity) {
      identity.addProfileListener(setProfile);
      return () => {
        identity.removeProfileListener(setProfile);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!state.username && !state.server) {
      clearTimeout(debounce.current)
      getRegistry(state.username, state.server)
    } else {
      clearTimeout(debounce.current)
      debounce.current = setTimeout(() => {
        getRegistry(state.username, state.server)
      }, 1000)
    }
  }, [state.username, state.server])

  const actions = {
    setUsername: (username: string) => {
      updateState({ username })
    },
    setServer: (server: string) => {
      updateState({ server })
    },
  }

  return { state, actions }
}
