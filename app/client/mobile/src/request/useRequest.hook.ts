import {useEffect, useState, useContext, useRef} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';

export function useRequest() {
  const display = useContext(DisplayContext) as ContextType;
  const app = useContext(AppContext) as ContextType;

  const [state, setState] = useState({
    profile: {} as Profile,
    strings: display.state.strings,
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const {identity} = app.state.session;
    const setProfile = (profile: Profile) => {
      const {guid} = profile;
    };
    identity.addProfileListener(setProfile);
    return () => {
      identity.removeProfileListener(setProfile);
    };
  }, [app.state.session]);

  useEffect(() => {
    const {fullDayTime, monthFirstDate} = app.state;
    updateState({fullDayTime, monthFirstDate});
  }, [app.state]);

  const actions = {
  };

  return {state, actions};
}
