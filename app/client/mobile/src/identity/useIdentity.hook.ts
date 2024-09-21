import { useEffect, useState, useContext, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { DisplayContext } from '../context/DisplayContext';
import { ContextType } from '../context/ContextType'

export function useIdentity() {
  const display = useContext(DisplayContext) as ContextType
  const app = useContext(AppContext) as ContextType

  const [state, setState] = useState({
    all: false,
    strings: display.state.strings,
    profile: {} as Profile,
    profileSet: false,
    imageUrl: null,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const identity = app.state.session?.getIdentity()
    if (!identity) {
      console.log('session not set in identity hook')
    } else {
      const setProfile = (profile: Profile) => {
        updateState({
          profile,
          profileSet: true,
          imageUrl: identity.getProfileImageUrl(),
        })
      }
      identity.addProfileListener(setProfile)
      return () => {
        identity.removeProfileListener(setProfile)
      }
    }
  }, [])

  const actions = {
    logout: async () => {
      await app.actions.accountLogout();
    }
  }

  return { state, actions }
}
