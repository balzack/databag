import { createContext } from 'react';
import { useChannelContext } from './useChannelContext.hook';

export const ChannelContext = createContext({});

export function ChannelContextProvider({ children }) {
  const { state, actions } = useChannelContext();
  return (
    <ChannelContext.Provider value={{ state, actions }}>
      {children}
    </ChannelContext.Provider>
  );
}

