import { useEffect, useContext, useState, useRef } from 'react';
import { getLanguageStrings } from '../constants/Strings';
import { useWindowDimensions } from 'react-native';

export function useSettingsContext() {
  const dim = useWindowDimensions();
  const [state, setState] = useState({
    strings: {},
    wide: null,
    splt: null,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const strings = getLanguageStrings();
    const wide = dim.width > dim.height;
    const split = dim.width > 650;
    updateState({ strings, wide, split });
  }, []);

  const actions = {
  };

  return { state, actions }
}

