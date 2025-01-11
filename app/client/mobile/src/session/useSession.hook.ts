import {useEffect, useState, useContext, useRef} from 'react';
import { AppState } from 'react-native';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';

export function useSession() {
  const display = useContext(DisplayContext) as ContextType;
  const app = useContext(AppContext) as ContextType;

  const [state, setState] = useState({
    layout: null,
    strings: {},
    appState: true,
    sdkState: true,
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const setSdkState = (state: string) => {
      updateState({ sdkState: state === 'connected' });
    }
    const setAppState = (state: string) => {
      updateState({ appState: state === 'active' });
    }
    const session = app.state.session;
    if (session) {
      session.addStatusListener(setSdkState);
      const sub = AppState.addEventListener('change', setAppState);
      return () => {
        session.removeStatusListener();
        sub.remove();
      }
    }
  }, [app.state.session]);

  useEffect(() => {
    const {layout, strings} = display.state;
    updateState({layout, strings});
  }, [display.state]);

  const actions = {
    logout: async () => {
      await app.actions.accountLogout();
    },
  };

  return {state, actions};
}
