import { createContext } from 'react';
import { defaultProfileContext, useProfileContext } from './useProfileContext.hook';

export const ProfileContext = createContext(defaultProfileContext);

export function ProfileContextProvider({ children }) {
  const { state, actions } = useProfileContext();
  return (
    <ProfileContext.Provider value={{ state, actions }}>
      {children}
    </ProfileContext.Provider>
  );
}

