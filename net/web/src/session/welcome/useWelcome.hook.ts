import { useContext, useState, useEffect } from 'react';
import { SettingsContext } from 'context/SettingsContext';

export function useWelcome() {

  const [state, setState] = useState({
    scheme: null,
    strings: {},
  });

  const settings = useContext(SettingsContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { scheme, strings } = settings.state;
    updateState({ scheme, strings });
  }, [settings.state]);

  const actions = {};

  return { state, actions };
}

