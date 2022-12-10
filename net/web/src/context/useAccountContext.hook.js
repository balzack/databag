import { useEffect, useContext, useState, useRef } from 'react';
import { setAccountSearchable } from 'api/setAccountSearchable';
import { setAccountSeal } from 'api/setAccountSeal';
import { getAccountStatus } from 'api/getAccountStatus';
import { setAccountLogin } from 'api/setAccountLogin';
import { StoreContext } from './StoreContext';

export function useAccountContext() {
  const [state, setState] = useState({
    init: false,
    status: null,
    seal: null,
    sealPrivate: null,
  });
  const access = useRef(null);
  const revision = useRef(null);
  const next = useRef(null);

  const storeContext = useContext(StoreContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    updateState({ sealKey: storeContext.state.sealKey });
  }, [storeContext.state.sealKey]);

  const setStatus = async (rev) => {
    if (next.current == null) {
      if (revision.current !== rev) {
        let status = await getAccountStatus(access.current);
        updateState({ init: true, status, seal: status.seal });
        revision.current = rev;
      }
      if (next.current != null) {
        let r = next.current;
        next.current = null;
        setStatus(r);
      }
    }
    else {
      next.current = rev;
    }
  }

  const actions = {
    setToken: (token) => {
      access.current = token;
    },
    clearToken: () => {
      access.current = null;
      revision.current = 0;
      setState({ init: false, seal: {}, sealKey: {} });
    },
    setRevision: async (rev) => {
      setStatus(rev);
    },
    setSearchable: async (flag) => {
      await setAccountSearchable(access.current, flag);
    },
    setSeal: async (seal, sealKey) => {
      await setAccountSeal(access.current, seal);
      await storeContext.actions.setValue("sealKey", sealKey);
      updateState({ sealKey });
    },
    updateSeal: async (seal) => {
      await setAccountSeal(access.current, seal);
    },
    unlockSeal: async (sealKey) => {
      await storeContext.actions.setValue("sealKey", sealKey);
      updateState({ sealKey });
    },
    setLogin: async (username, password) => {
      await setAccountLogin(access.current, username, password);
    },
  }

  return { state, actions }
}


