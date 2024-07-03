import { useState, useEffect } from 'react';
import { DatabagSDK, WebStore, Session } from 'databag-client-sdk';

class Store implements WebStore {
  public async getValue(key: string): Promise<string> {
    return '';
  }

  public async setValue(key: string, value: string): Promise<void> {
  }

  public async clearValue(key: string): Promise<void> {
  }

  public async clearAll(): Promise<void> {
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
    const session: Session | null = await sdk.initOnlineStore(store);
    console.log(session);
    updateState({ sdk, session });
  };

  const actions = {
  }

  return { state, actions }
}

