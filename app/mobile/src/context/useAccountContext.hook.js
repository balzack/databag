import { useState, useRef, useContext } from 'react';
import { StoreContext } from 'context/StoreContext';
import { setAccountSeal } from 'api/setAccountSeal';
import { setAccountSearchable } from 'api/setAccountSearchable';
import { setAccountNotifications } from 'api/setAccountNotifications';
import { getAccountStatus } from 'api/getAccountStatus';
import { setAccountLogin } from 'api/setAccountLogin';

export function useAccountContext() {
  const [state, setState] = useState({
    status: {},
  });
  const store = useContext(StoreContext);

  const session = useRef(null);
  const curRevision = useRef(null);
  const setRevision = useRef(null);
  const syncing = useRef(false);
  
  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const sync = async () => {
    if (!syncing.current && setRevision.current !== curRevision.current) {
      syncing.current = true;

      try {
        const revision = curRevision.current;
        const { server, appToken, guid } = session.current;
        const status = await getAccountStatus(server, appToken);
        await store.actions.setAccountStatus(guid, status);
        await store.actions.setAccountRevision(guid, revision);
        updateState({ status });
        setRevision.current = revision;
      }
      catch(err) {
        console.log(err);
        syncing.current = false;
        return;
      }

      syncing.current = false;
      sync();
    }
  };

  const actions = {
    setSession: async (access) => {
      const { guid, server, appToken } = access;
      const status = await store.actions.getAccountStatus(guid);
      const sealKey = await store.actions.getAccountSealKey(guid);
      const revision = await store.actions.getAccountRevision(guid);
      updateState({ status, sealKey });
      setRevision.current = revision;
      curRevision.current = revision;
      session.current = access;
    },
    clearSession: () => {
      session.current = {};
      updateState({ account: null });
    },
    setRevision: (rev) => {
      curRevision.current = rev;
      sync();
    },
    setNotifications: async (flag) => {
      const { server, appToken } = session.current;
      await setAccountNotifications(server, appToken, flag);
    },
    setSearchable: async (flag) => {
      const { server, appToken } = session.current;
      await setAccountSearchable(server, appToken, flag);
    },
    setAccountSeal: async (seal, key) => {
      const { guid, server, appToken } = session.current;
      await setAccountSeal(server, appToken, seal);
      await store.actions.setAccountSealKey(guid, key);
      updateState({ sealKey: key });
    },
    unlockAccountSeal: async (key) => {
      const { guid } = session.current;
      await store.actions.setAccountSealKey(guid, key);
      updateState({ sealKey: key });
    },
    setLogin: async (username, password) => {
      const { server, appToken } = session.current;
      await setAccountLogin(server, appToken, username, password);
    },
  }

  return { state, actions }
}


