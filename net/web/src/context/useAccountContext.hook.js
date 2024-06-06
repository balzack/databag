import { useEffect, useContext, useState, useRef } from 'react';
import { setAccountSearchable } from 'api/setAccountSearchable';
import { setAccountNotifications } from 'api/setAccountNotifications';
import { setAccountSeal } from 'api/setAccountSeal';
import { getAccountStatus } from 'api/getAccountStatus';
import { setAccountLogin } from 'api/setAccountLogin';
import { addAccountMFA } from 'api/addAccountMFA';
import { setAccountMFA } from 'api/setAccountMFA';
import { removeAccountMFA } from 'api/removeAccountMFA';
import { StoreContext } from './StoreContext';

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function useAccountContext() {
  const [state, setState] = useState({
    offsync: false,
    status: null,
    seal: null,
    sealKey: null,
    webPushKey: null,
  });
  const access = useRef(null);
  const setRevision = useRef(null);
  const curRevision = useRef(null);
  const syncing = useRef(false);
  const force = useRef(false); 

  const storeContext = useContext(StoreContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

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
        const { seal, webPushKey } = status || {};

        setRevision.current = revision;
        updateState({ offsync: false, status, seal, webPushKey });
      }
      catch (err) {
        console.log(err);
        syncing.current = false;
        updateState({ offsync: true });
        return;
      }

      syncing.current = false;
      await sync();
    }
  }

  const actions = {
    setToken: (token) => {
      if (access.current || syncing.current) {
        throw new Error("invalid account session state");
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
    setPushEnabled: async (flag) => {
      if (flag) {
        const status = await Notification.requestPermission();
        if (status === 'granted') {
          const registration = await navigator.serviceWorker.register('push.js');
          await navigator.serviceWorker.ready;
          const params = { userVisibleOnly: true, applicationServerKey: urlB64ToUint8Array(state.webPushKey) };
          const subscription = await registration.pushManager.subscribe(params);

          const endpoint = subscription.endpoint;
          const binPublicKey = subscription.getKey('p256dh');
          const binAuth = subscription.getKey('auth');

          if (endpoint && binPublicKey && binAuth) {
            const numPublicKey = [];
            (new Uint8Array(binPublicKey)).forEach(val => {
              numPublicKey.push(val);
            });
            const numAuth = [];
            (new Uint8Array(binAuth)).forEach(val => {
              numAuth.push(val);
            });
            const publicKey = btoa(String.fromCharCode.apply(null, numPublicKey));
            const auth = btoa(String.fromCharCode.apply(null, numAuth));

            await setAccountNotifications(access.current, endpoint, publicKey, auth, true);
          }
        }
      }
      else {
        await setAccountNotifications(access.current, '', '', '', false);
      }
    },
    enableMFA: async () => {
      const secret = await addAccountMFA(access.current);
      return secret;
    },
    disableMFA: async () => {
      await removeAccountMFA(access.current);
    },
    confirmMFA: async (code) => {
      await setAccountMFA(access.current, code);
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
    resync: async () => {
      force.current = true;
      await sync();
    },
  }

  return { state, actions }
}


