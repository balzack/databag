import { createContext } from 'react';
import { useAccountContext } from './useAccountContext.hook';

export const AccountContext = createContext({});

export function AccountContextProvider({ children }) {
  const { state, actions } = useAccountContext();
  return (
    <AccountContext.Provider value={{ state, actions }}>
      {children}
    </AccountContext.Provider>
  );
}

