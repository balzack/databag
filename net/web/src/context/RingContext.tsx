import { createContext } from 'react';
import { defaultRingContext, useRingContext } from './useRingContext.hook';

export const RingContext = createContext(defaultRingContext);

export function RingContextProvider({ children }) {
  const { state, actions } = useRingContext();
  return <RingContext.Provider value={{ state, actions }}>{children}</RingContext.Provider>;
}
