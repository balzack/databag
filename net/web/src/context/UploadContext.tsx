import { createContext } from 'react';
import { defaultUploadContext, useUploadContext } from './useUploadContext.hook';

export const UploadContext = createContext(defaultUploadContext);

export function UploadContextProvider({ children }) {
  const { state, actions } = useUploadContext();
  return <UploadContext.Provider value={{ state, actions }}>{children}</UploadContext.Provider>;
}
