import { createContext } from 'react';
import { defaultCardContext, useCardContext } from './useCardContext.hook';

export const CardContext = createContext(defaultCardContext);

export function CardContextProvider({ children }) {
  const { state, actions } = useCardContext();
  return <CardContext.Provider value={{ state, actions }}>{children}</CardContext.Provider>;
}
