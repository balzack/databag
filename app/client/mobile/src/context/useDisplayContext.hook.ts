import {useEffect, useContext, useState, useRef} from 'react';
import {getLanguageStrings} from '../constants/Strings';
import {useWindowDimensions} from 'react-native';

export function useDisplayContext() {
  const dim = useWindowDimensions();
  const [state, setState] = useState({
    strings: getLanguageStrings(),
    layout: null,
  });

  const SMALL_LARGE = 650;

  const updateState = value => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const layout = dim.width < SMALL_LARGE ? 'small' : 'large'
    updateState({ layout });
  }, [dim.width]);

  const actions = {};

  return {state, actions};
}
