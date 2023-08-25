import { useState, useEffect, useRef, useContext } from 'react';
import { getLanguageStrings } from 'constants/Strings';

export function useSettings() {

  const [state, setState] = useState({
    strings: getLanguageStrings(),
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
  };

  return { state, actions };
}


