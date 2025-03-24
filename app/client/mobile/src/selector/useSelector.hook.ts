import {useContext} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';

export function useSelector() {
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;

  const state = {
    strings: display.state.strings,
  };

  const actions = {
    clearFocus: app.actions.clearFocus,
  };

  return {state, actions};
}
