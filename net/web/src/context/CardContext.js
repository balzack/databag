import { createContext } from 'react';
import { useCardContext } from './useCardContext.hook';

export const CardContext = createContext({});

export function CardContextProvider({ children }) {
  const { state, actions } = useCardContext();
  return (
    <CardContext.Provider value={{ state, actions }}>
      {children}
    </CardContext.Provider>
  );
}

