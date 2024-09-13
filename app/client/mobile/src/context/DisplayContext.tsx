import {createContext} from 'react';
import {useDisplayContext} from './useDisplayContext.hook';

export const DisplayContext = createContext({});

export function DisplayContextProvider({children}) {
  const {state, actions} = useDisplayContext();
  return (
    <DisplayContext.Provider value={{state, actions}}>
      {children}
    </DisplayContext.Provider>
  );
}
