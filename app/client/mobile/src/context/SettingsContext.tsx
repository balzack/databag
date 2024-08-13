import {createContext} from 'react';
import {useSettingsContext} from './useSettingsContext.hook';

export const SettingsContext = createContext({});

export function SettingsContextProvider({children}) {
  const {state, actions} = useSettingsContext();
  return (
    <SettingsContext.Provider value={{state, actions}}>
      {children}
    </SettingsContext.Provider>
  );
}
