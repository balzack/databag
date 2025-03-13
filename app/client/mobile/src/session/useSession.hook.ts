import {useEffect, useState, useContext, useRef} from 'react';
import { AppState } from 'react-native';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';
import SplashScreen from 'react-native-splash-screen';

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
    const setContentState = (loaded: boolean) => {
      if (loaded) {
        SplashScreen.hide();
      }
    }
    const setSdkState = (state: string) => {
      updateState({ sdkState: state === 'connected' });
    }
    const setAppState = (state: string) => {
      updateState({ appState: state === 'active' });
    }
    const session = app.state.session;
    if (session) {
      const content = session.getContent();
      content.addLoadedListener(setContentState);
      session.addStatusListener(setSdkState);
      const sub = AppState.addEventListener('change', setAppState);
      return () => {
        session.removeStatusListener(setSdkState);
        content.removeLoadedListener(setContentState);
        sub.remove();
      }
    }
  }, [app.state.session]);

  useEffect(() => {
    const {layout, strings} = display.state;
    updateState({layout, strings});
  }, [display.state]);

  const actions = {
    clearWelcome: async () => {
      await app.actions.setShowWelcome(false);
    },
    logout: async () => {
      await app.actions.accountLogout();
    },
  };

  return {state, actions};
}
