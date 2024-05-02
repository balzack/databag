import { createContext } from 'react';
import { defaultAppContext, useAppContext } from './useAppContext.hook';

export const AppContext = createContext(defaultAppContext);

export function AppContextProvider({ children }) {
  const { state, actions } = useAppContext();
  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

