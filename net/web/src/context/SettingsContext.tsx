import { createContext } from 'react';
import { defaultSettingsContext, useSettingsContext } from './useSettingsContext.hook';

export const SettingsContext = createContext(defaultSettingsContext);

export function SettingsContextProvider({ children }) {
  const { state, actions } = useSettingsContext();
  return (
    <SettingsContext.Provider value={{ state, actions }}>
      {children}
    </SettingsContext.Provider>
  );
}

