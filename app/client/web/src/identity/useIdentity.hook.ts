import { useState, useContext, useEffect } from 'react'
import { DisplayContext } from '../context/DisplayContext'
import { ContextType } from '../context/ContextType'

export function useIdentity() {
  const display = useContext(DisplayContext) as ContextType
  const [state, setState] = useState({
    strings: display.state.strings,
  });

  const actions = {
  };

  return { state, actions };
}
