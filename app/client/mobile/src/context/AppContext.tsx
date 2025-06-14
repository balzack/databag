import React, {createContext} from 'react';
import {useAppContext} from './useAppContext.hook';

export const AppContext = createContext({});

export type UnsetTopic = {
  assets: {type: string; path: string; mime?: string; position?: number; label?: string; size?: number}[];
  message: string | null;
};

export function AppContextProvider({children}) {
  const {state, actions} = useAppContext();
  return <AppContext.Provider value={{state, actions}}>{children}</AppContext.Provider>;
}
