import { createContext } from 'react';
import { useConversationContext } from './useConversationContext.hook';

export const ConversationContext = createContext({});

export function ConversationContextProvider({ children }) {
  const { state, actions } = useConversationContext();
  return (
    <ConversationContext.Provider value={{ state, actions }}>
      {children}
    </ConversationContext.Provider>
  );
}

