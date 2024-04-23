import { createContext } from 'react';
import { useStoreContext } from './useStoreContext.hook';

export const StoreContext = createContext({});

export function StoreContextProvider({ children }) {
  const { state, actions } = useStoreContext();
  return (
    <StoreContext.Provider value={{ state, actions }}>
      {children}
    </StoreContext.Provider>
  );
}

