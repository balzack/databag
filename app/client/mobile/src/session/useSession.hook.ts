import {useEffect, useState, useContext, useRef} from 'react';
import { AppState } from 'react-native';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';

export function useSession() {
  const display = useContext(DisplayContext) as ContextType;
  const app = useContext(AppContext) as ContextType;
  const disconnecting = useRef(null);

  const [state, setState] = useState({
    layout: null,
    strings: {},
    disconnected: false,
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const setStatus = (status: string) => {
      if (state.appState === 'active' && status === 'disconnected') {
        disconnecting.current = setTimeout(() => {
          updateState({ disconnected: true });
        }, 4000);
      } if (status === 'connected') {
        clearTimeout(disconnecting.current);
        updateState({ disconnected: false });
      }
    }
    const setAppState = (appState: string) => {
      updateState({ appState });
    }
    const session = app.state.session;
    if (session) {
      session.addStatusListener(setStatus);
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
