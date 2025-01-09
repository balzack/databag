import {useState, useContext, useEffect, useRef} from 'react';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';

export function useDetails() {
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    strings: display.state.strings,
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  const actions = {
  };

  return {state, actions};
}
