import { createContext } from 'react';
import { useGroupContext } from './useGroupContext.hook';

export const GroupContext = createContext({});

export function GroupContextProvider({ children }) {
  const { state, actions } = useGroupContext();
  return (
    <GroupContext.Provider value={{ state, actions }}>
      {children}
    </GroupContext.Provider>
  );
}

