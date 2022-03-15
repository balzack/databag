import { createContext } from 'react';
import useAppContext from './useAppContext.hook';

export const AppContext = createContext({});

export function AppContextProvider({ children }) {
  const state = useAppContext();
  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  );
}

