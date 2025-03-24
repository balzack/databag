import {useEffect, useState} from 'react';
import {getLanguageStrings} from '../constants/Strings';
import {useWindowDimensions} from 'react-native';

export function useDisplayContext() {
  const dim = useWindowDimensions();
  const [state, setState] = useState({
    strings: getLanguageStrings(),
    layout: null,
    width: 0,
    height: 0,
  });

  const SMALL_LARGE = 650;

  const updateState = value => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const layout = dim.width < SMALL_LARGE ? 'small' : 'large';
    updateState({layout, width: dim.width, height: dim.height});
  }, [dim.height, dim.width]);

  const actions = {};

  return {state, actions};
}
