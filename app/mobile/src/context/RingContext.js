import { createContext } from 'react';
import { useRingContext } from './useRingContext.hook';

export const RingContext = createContext({});

export function RingContextProvider({ children }) {
  const { state, actions } = useRingContext();
  return (
    <RingContext.Provider value={{ state, actions }}>
      {children}
    </RingContext.Provider>
  );
}

