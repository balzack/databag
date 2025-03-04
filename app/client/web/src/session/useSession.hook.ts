import { useState, useContext, useEffect, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { DisplayContext } from '../context/DisplayContext'
import { ContextType } from '../context/ContextType'
import { Focus } from 'databag-client-sdk'

export function useSession() {
  const app = useContext(AppContext) as ContextType
  const display = useContext(DisplayContext) as ContextType
  const [state, setState] = useState({
    focus: null as Focus | null,
    layout: null,
    strings: display.state.strings,
    disconnected: false,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const setStatus = (status: string) => {
      if (status === 'disconnected') {
        updateState({ disconnected: true });
      } if (status === 'connected') {
        updateState({ disconnected: false });
      }
    }
    const session = app.state.session;
    if (session) {
      session.addStatusListener(setStatus);
      return () => session.removeStatusListener();
    }
  }, [app.state.session]);

  useEffect(() => {
    const { layout, strings } = display.state
    updateState({ layout, strings })
  }, [display.state])

  useEffect(() => {
    const { focus } = app.state
    updateState({ focus });
  }, [app.state ]);

  const actions = { }

  return { state, actions }
}
