import { useState, useRef, useContext } from 'react';
import { StoreContext } from 'context/StoreContext';
import { setAccountSeal } from 'api/setAccountSeal';
import { setAccountSearchable } from 'api/setAccountSearchable';
import { setAccountNotifications } from 'api/setAccountNotifications';
import { getAccountStatus } from 'api/getAccountStatus';
import { setAccountLogin } from 'api/setAccountLogin';
import { addAccountMFA } from 'api/addAccountMFA';
import { setAccountMFA } from 'api/setAccountMFA';
import { removeAccountMFA } from 'api/removeAccountMFA';

export function useAccountContext() {
  const [state, setState] = useState({
    offsync: false,
    status: {},
  });
  const store = useContext(StoreContext);

  const access = useRef(null);
  const curRevision = useRef(null);
  const setRevision = useRef(null);
  const syncing = useRef(false);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const sync = async () => {
    if (access.current && !syncing.current && setRevision.current !== curRevision.current) {
      syncing.current = true;
      try {
        const revision = curRevision.current;
        const { server, token, guid } = access.current || {};
        const status = await getAccountStatus(server, token);
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
    setSession: async (session) => {
      if (access.current || syncing.current) {
        throw new Error('invalid account state');
      }
      access.current = session;
      const { guid, server, token } = session || {};
      const status = await store.actions.getAccountStatus(guid);
      const sealKey = await store.actions.getAccountSealKey(guid);
      const revision = await store.actions.getAccountRevision(guid);
      updateState({ status, sealKey });
      setRevision.current = revision;
      curRevision.current = revision;
    },
    clearSession: () => {
      access.current = null;
      updateState({ account: {} });
    },
    setRevision: (rev) => {
      curRevision.current = rev;
      sync();
    },
    setNotifications: async (flag) => {
      const { server, token } = access.current || {};
      await setAccountNotifications(server, token, flag);
    },
    setSearchable: async (flag) => {
      const { server, token } = access.current || {};
      await setAccountSearchable(server, token, flag);
    },
    enableMFA: async () => {
      const { server, token } = access.current || {};
      const secret = await addAccountMFA(server, token);
      return secret;
    },
    disableMFA: async () => {
      const { server, token } = access.current || {};
      await removeAccountMFA(server, token);
    },
    confirmMFA: async (code) => {
      const { server, token } = access.current || {};
      await setAccountMFA(server, token, code);
    },
    setAccountSeal: async (seal, key) => {
      const { guid, server, token } = access.current || {};
      await setAccountSeal(server, token, seal);
      await store.actions.setAccountSealKey(guid, key);
      updateState({ sealKey: key });
    },
    unlockAccountSeal: async (key) => {
      const { guid } = access.current || {};
      await store.actions.setAccountSealKey(guid, key);
      updateState({ sealKey: key });
    },
    setLogin: async (username, password) => {
      const { server, token } = access.current || {};
      await setAccountLogin(server, token, username, password);
    },
    resync: async () => {
      await sync();
    }
  }

  return { state, actions }
}


