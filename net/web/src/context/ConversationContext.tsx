import { createContext } from 'react';
import { defaultConversionContext, useConversationContext } from './useConversationContext.hook';

export const ConversationContext = createContext(defaultConversionContext);

export function ConversationContextProvider({ children }) {
  const { state, actions } = useConversationContext();
  return <ConversationContext.Provider value={{ state, actions }}>{children}</ConversationContext.Provider>;
}
