import {useState, useContext, useEffect} from 'react';
import {DisplayContext} from '../context/DisplayContext';
import {AppContext} from '../context/AppContext';
import {ContextType} from '../context/ContextType';

export function useOnboard() {
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    strings: display.state.strings,
    show: null as null | boolean,
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const show = app.state.showWelcome;
    updateState({show});
  }, [app.state]);

  const actions = {
    done: async () => {
      await app.actions.setShowWelcome(false);
    },
  };

  return {state, actions};
}
