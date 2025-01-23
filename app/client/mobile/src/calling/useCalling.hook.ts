import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { ContextType } from '../context/ContextType'

export function useCalling() {
  const app = useContext(AppContext) as ContextType
  const [state, setState] = useState({
    ringing: [],
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    if (app.state.session) {
      const setRinging = (ringing: { cardId: string, callId: string }[]) => {
        updateState({ ringing });
      }
      const ring = app.state.session.getRing();
      ring.addRingingListener(setRinging);
      return () => {
        ring.removeRingingListener(setRinging);
      }
    }
  }, [app.state.session]);

  const actions = {
    call: (cardId: string) => {
      console.log('calling: ', cardId);
    },
  }

  return { state, actions }
}
