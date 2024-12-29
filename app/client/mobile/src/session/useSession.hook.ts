import {useEffect, useState, useContext} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';

export function useSession() {
  const display = useContext(DisplayContext) as ContextType;
  const app = useContext(AppContext) as ContextType;

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
