import {useEffect, useState, useContext, useRef} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';

export function useContacts() {
  const display = useContext(DisplayContext) as ContextType;
  const app = useContext(AppContext) as ContextType;
  const debounce = useRef(setTimeout(() => {}, 0));

  const [state, setState] = useState({
    strings: display.state.strings,
  });

  const actions = {
  };

  return { state, actions };
}

