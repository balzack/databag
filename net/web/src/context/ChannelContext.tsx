import { createContext } from 'react';
import { defaultChannelContext, useChannelContext } from './useChannelContext.hook';

export const ChannelContext = createContext(defaultChannelContext);

export function ChannelContextProvider({ children }) {
  const { state, actions } = useChannelContext();
  return <ChannelContext.Provider value={{ state, actions }}>{children}</ChannelContext.Provider>;
}
