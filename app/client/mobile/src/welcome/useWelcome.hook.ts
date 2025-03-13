import { useState, useContext, useEffect } from 'react'
import { DisplayContext } from '../context/DisplayContext';
import { AppContext } from '../context/AppContext';
import { ContextType } from '../context/ContextType'

export function useWelcome() {
  const app = useContext(AppContext) as ContextType
  const display = useContext(DisplayContext) as ContextType
  const [state, setState] = useState({
    strings: display.state.strings,
    showWelcome: null as null | boolean,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
console.log("-------> SETTING!");
console.log("-------> SETTING!");
console.log("-------> SETTING!");
console.log("-------> SETTING!");
console.log("-------> SETTING!");
console.log("-------> SETTING!");
  console.log(app.state);

    const showWelcome = app.state.showWelcome;
    updateState({ showWelcome });
  }, [app.state]);

  const actions = {
    clearWelcome: async () => {
      await app.actions.setShowWelcome(false);
    },
  }

  return { state, actions }
}
