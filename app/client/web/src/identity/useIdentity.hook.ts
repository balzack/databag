import { useState, useContext, useEffect } from 'react'
import { DisplayContext } from '../context/DisplayContext'
import { AppContext } from '../context/AppContext'
import { ContextType } from '../context/ContextType'

export function useIdentity() {
  const app = useContext(AppContext) as ContextType
  const display = useContext(DisplayContext) as ContextType
  const [state, setState] = useState({
    all: false,
    strings: display.state.strings,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  const actions = {
    setAll: (all) => {
      updateState({ all });
    },
    logout: async () => {
      await app.actions.accountLogout(state.all);
    },
  };

  return { state, actions };
}
