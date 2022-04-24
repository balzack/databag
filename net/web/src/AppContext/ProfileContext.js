import { createContext } from 'react';
import { useProfileContext } from './useProfileContext.hook';

export const ProfileContext = createContext({});

export function ProfileContextProvider({ children }) {
  const { state, actions } = useProfileContext();
  return (
    <ProfileContext.Provider value={{ state, actions }}>
      {children}
    </ProfileContext.Provider>
  );
}

