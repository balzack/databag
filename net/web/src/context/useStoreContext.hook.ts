import { useEffect, useState } from 'react';

export const defaultStoreContext = {
  state: {} as Record<string, any>,
  actions: {
    clear: () => {},
    setValue: (key: any, value: any) => {},
    getValue: (key: any) => undefined as any,
  },
};
export function useStoreContext() {
  const [state, setState] = useState({});

  const resetState = () => {
    setState((s) => {
      localStorage.setItem('store', JSON.stringify({}));
      return {};
    });
  };

  const updateState = (value) => {
    setState((s) => {
      const store = { ...s, ...value };
      localStorage.setItem('store', JSON.stringify(store));
      return store;
    });
  };

  useEffect(() => {
    const store = localStorage.getItem('store');
    if (store != null) {
      updateState({ ...JSON.parse(store) });
    }
  }, []);

  const actions = {
    clear: () => {
      resetState();
    },
    setValue: (key, value) => {
      updateState({ [key]: value });
    },
    getValue: (key) => {
      return state[key];
    },
  };

  return { state, actions };
}
