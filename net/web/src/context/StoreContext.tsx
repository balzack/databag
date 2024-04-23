import { createContext } from 'react';
import { defaultStoreContext, useStoreContext } from './useStoreContext.hook';

export const StoreContext = createContext(defaultStoreContext);

export function StoreContextProvider({ children }) {
  const { state, actions } = useStoreContext();
  return (
    <StoreContext.Provider value={{ state, actions }}>
      {children}
    </StoreContext.Provider>
  );
}

