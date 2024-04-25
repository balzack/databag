import { useEffect, useContext, useState, useRef } from 'react';
import { setAccountSearchable } from 'api/setAccountSearchable';
import { setAccountSeal } from 'api/setAccountSeal';
import { getAccountStatus } from 'api/getAccountStatus';
import { setAccountLogin } from 'api/setAccountLogin';
import { StoreContext } from './StoreContext';

export const defaultAccountContext = {
  state: {
    offsync: false,
    status: null,
    seal: null,
    sealKey: null,
  },
  actions: {
    setToken: (token: any) => {},
    clearToken: () => {},
    setRevision: (rev: any) => Promise.reject<void>(),
    setSearchable: (flag: any) => Promise.reject<void>(),
    setSeal: (seal: any, sealKey: any) => Promise.reject<void>(),
    updateSeal: (seal: any) => Promise.reject<void>(),
    unlockSeal: (sealKey: any) => Promise.reject<void>(),
    setLogin: (username: any, password: any) => Promise.reject<void>(),
    resync: () => Promise.reject<void>(),
  },
};

export function useAccountContext(): typeof defaultAccountContext {
  const [state, setState] = useState(defaultAccountContext.state);
  const access = useRef(null);
  const setRevision = useRef(null);
  const curRevision = useRef(null);
  const syncing = useRef(false);
  const force = useRef(false);

  const storeContext = useContext(StoreContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  };

  useEffect(() => {
    updateState({ sealKey: storeContext.state.sealKey });
  }, [storeContext.state]);

  const sync = async () => {
    if (!syncing.current && (setRevision.current !== curRevision.current || force.current)) {
      syncing.current = true;
      force.current = false;

      try {
        const token = access.current;
        const revision = curRevision.current;
        const status = await getAccountStatus(token);
        setRevision.current = revision;
        updateState({ offsync: false, status, seal: status.seal });
      } catch (err) {
        console.log(err);
        syncing.current = false;
        updateState({ offsync: true });
        return;
      }

      syncing.current = false;
      await sync();
    }
  };

  const actions = {
    setToken: (token) => {
      if (access.current || syncing.current) {
        throw new Error('invalid account session state');
      }
      access.current = token;
      curRevision.current = null;
      setRevision.current = null;
      setState({ offsync: false, status: null, seal: null, sealKey: null });
    },
    clearToken: () => {
      access.current = null;
    },
    setRevision: async (rev) => {
      curRevision.current = rev;
      await sync();
    },
    setSearchable: async (flag) => {
      await setAccountSearchable(access.current, flag);
    },
    setSeal: async (seal, sealKey) => {
      await setAccountSeal(access.current, seal);
      await storeContext.actions.setValue('sealKey', sealKey);
      updateState({ sealKey });
    },
    updateSeal: async (seal) => {
      await setAccountSeal(access.current, seal);
    },
    unlockSeal: async (sealKey) => {
      await storeContext.actions.setValue('sealKey', sealKey);
      updateState({ sealKey });
    },
    setLogin: async (username, password) => {
      await setAccountLogin(access.current, username, password);
    },
    resync: async () => {
      force.current = true;
      await sync();
    },
  };

  return { state, actions };
}
