import {useEffect, useState, useContext} from 'react';
import {en, fr, es, pt, de, ru, el} from '../constants/Strings';
import {useWindowDimensions, Platform} from 'react-native';
import {AppContext} from './AppContext';
import {ContextType} from './ContextType';

export function useDisplayContext() {
  const app = useContext(AppContext) as ContextType;
  const dim = useWindowDimensions();
  const [locked, setLocked] = useState(false);
  const [state, setState] = useState({
    strings: {},
    layout: null,
    width: 0,
    height: 0,
  });

  const SMALL_LARGE = 650;

  const updateState = value => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const layout = Platform.isPad ? 'large' : 'small';
    if (locked) {
      updateState({width: dim.width, height: dim.height});
    } else {
      updateState({layout, width: dim.width, height: dim.height});
    }
  }, [dim.height, dim.width, locked]);

  useEffect(() => {
    const lang = app.state.language;
    const strings = lang === 'fr' ? fr : lang === 'es' ? es : lang === 'pt' ? pt : lang === 'de' ? de : lang === 'ru' ? ru : lang === 'el' ? el : en;
    updateState({strings});
  }, [app.state.language]);

  const actions = {
    lockLayout: (locked: boolean) => {
      setLocked(locked);
    },
  };

  return {state, actions};
}
