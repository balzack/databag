import { useContext, useState, useRef } from 'react';
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

  const setStatus = async (rev) => {
    if (next.current == null) {
      if (revision.current !== rev) {
        let status = await getAccountStatus(access.current);
        let seal = status.seal?.publicKey ? status.seal : null;
        let sealPrivate = null;
        const pubKey = await storeContext.actions.getValue("seal:public");
        const privKey = await storeContext.actions.getValue("seal:private");
        if (status.seal?.publicKey == null) {
          if (pubKey != null) {
            await storeContext.actions.setValue("seal:public", null);
          }
          if (privKey != null) {
            await storeContext.actions.setValue("seal:private", null);
          }
        }
        else {
          if (pubKey !== status.seal?.publicKey) {
            if (privKey != null) {
              await storeContext.actions.setValue("seal:private", null);
            }
            await storeContext.actions.setValue("seal:public", status.seal?.publicKey);
          }
          if (privKey != null) {
            sealPrivate = privKey;
          }
        }
        updateState({ init: true, status, seal, sealPrivate });
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
      setState({ init: false });
    },
    setRevision: async (rev) => {
      setStatus(rev);
    },
    setSearchable: async (flag) => {
      await setAccountSearchable(access.current, flag);
    },
    setSeal: async (seal, sealPrivate) => {
      await storeContext.actions.setValue("seal:private", null);
      await storeContext.actions.setValue("seal:public", seal.publicKey);
      await storeContext.actions.setValue("seal:private", sealPrivate);
      await setAccountSeal(access.current, seal);
      updateState({ seal, sealPrivate });
    },
    unlockSeal: async (sealPrivate) => {
console.log("UNLOCKING: ", sealPrivate);
      await storeContext.actions.setValue("seal:private", sealPrivate);
      updateState({ sealPrivate });
    },
    setLogin: async (username, password) => {
      await setAccountLogin(access.current, username, password);
    },
  }

  return { state, actions }
}


