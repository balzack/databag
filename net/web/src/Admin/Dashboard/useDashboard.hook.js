import { useState, useEffect } from 'react';
import { setNodeConfig } from 'api/setNodeConfig';

export function useDashboard(password, config) {

  const [state, setState] = useState({
    host: "",
    storage: null,
    showSettings: false,
    busy: false,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    let storage = config.accountStorage / 1073741824;
    if (storage > 1) {
      storage = Math.ceil(storage);
    }
    updateState({ host: config.domain, storage: storage });
  }, []);

  const actions = {
    setHost: (value) => {
      updateState({ host: value });
    },
    setStorage: (value) => {
      updateState({ storage: value });
    },
    setShowSettings: (value) => {
      updateState({ showSettings: value });
    },
    onSaveSettings: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          await setNodeConfig(password,
            { ...state.config, domain: state.host, accountStorage: state.storage * 1073741824 });
          updateState({ showSettings: false });
        }
        catch(err) {
          console.log(err);
          window.alert(err);
        }
        updateState({ busy: false });
      }
    },
  };

  return { state, actions };
}

