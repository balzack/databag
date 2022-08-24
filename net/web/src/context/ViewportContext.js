import { createContext } from 'react';
import { useViewportContext } from './useViewportContext.hook';

export const ViewportContext = createContext({});

export function ViewportContextProvider({ children }) {
  const { state, actions } = useViewportContext();
  return (
    <ViewportContext.Provider value={{ state, actions }}>
      {children}
    </ViewportContext.Provider>
  );
}

