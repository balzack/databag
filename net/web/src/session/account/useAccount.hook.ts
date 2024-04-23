import { useState, useEffect, useContext } from 'react';
import { SettingsContext } from 'context/SettingsContext';

export function useAccount() {
  
  const [state, setState] = useState({
    strings: {} as Record<string,string>,
  });

  const settings = useContext(SettingsContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { strings } = settings.state;
    updateState({ strings });
  }, [settings.state]);

  const actions = {
  };

  return { state, actions };
}

