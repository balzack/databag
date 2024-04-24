import { createContext } from 'react';
import { defaultAccountContext, useAccountContext } from './useAccountContext.hook';

export const AccountContext = createContext(defaultAccountContext);

export function AccountContextProvider({ children }) {
  const { state, actions } = useAccountContext();
  return (
    <AccountContext.Provider value={{ state, actions }}>
      {children}
    </AccountContext.Provider>
  );
}

