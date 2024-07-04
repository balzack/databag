import { useState, useEffect } from 'react';
import { DatabagSDK, SqlStore, Session } from 'databag-client-sdk';

class Store implements SqlStore {
  set(stmt: string, params: (string | number)[]): Promise<void> {
    console.log("store set");
  }

  get(stmt: string, params: (string | number)[]): Promise<any[]> {
    console.log("store get");
  }
};

export function useAppContext() {
  const [state, setState] = useState({});

  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => { init() }, []);

  const init = async () => {
    const sdk = new DatabagSDK(null);
    const store = new Store();
    const session = await sdk.initOfflineStore(store);
    updateState('databag sdk');
  };

  const actions = {
  }

  return { state, actions }
}

