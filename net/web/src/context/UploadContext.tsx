import { createContext } from 'react';
import { useUploadContext } from './useUploadContext.hook';

export const UploadContext = createContext({});

export function UploadContextProvider({ children }) {
  const { state, actions } = useUploadContext();
  return (
    <UploadContext.Provider value={{ state, actions }}>
      {children}
    </UploadContext.Provider>
  );
}

