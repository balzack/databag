import { useState, useEffect } from 'react';
import { setNodeConfig } from 'api/setNodeConfig';
import { getNodeAccounts } from 'api/getNodeAccounts';
import { removeAccount } from 'api/removeAccount';
import { addAccountCreate } from 'api/addAccountCreate';

export function useDashboard(token, config) {

  const [state, setState] = useState({
    host: "",
    storage: null,
    showSettings: false,
    busy: false,
    loading: false,
    accounts: [],
    createBusy: false,
    showCreate: false,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setCreateLink: async () => {
      if (!state.createBusy) {
        updateState({ createBusy: true });
        try {
          let create = await addAccountCreate(token)
          updateState({ createToken: create, showCreate: true });
        }
        catch (err) {
          window.alert(err);
        }
        updateState({ createBusy: false });
      }
    },
    setShowCreate: (showCreate) => {
      updateState({ showCreate });
    },
    removeAccount: async (accountId) => {
      await removeAccount(token, accountId);
      actions.getAccounts();
    },
    setHost: (value) => {
      updateState({ host: value });
    },
    setStorage: (value) => {
      updateState({ storage: value });
    },
    setShowSettings: (value) => {
      updateState({ showSettings: value });
    },
    setSettings: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          await setNodeConfig(token,
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
    getAccounts: async () => {
      if (!state.loading) {
        updateState({ loading: true });
        try {
          let accounts = await getNodeAccounts(token);
          accounts.sort((a, b) => {
            if (a.handle < b.handle) {
              return -1;
            }
            if (a.handle > b.handle) {
              return 1;
            }
            return 0;
          });
          updateState({ accounts });
        }
        catch(err) {
          console.log(err);
          window.alert(err);
        }
        updateState({ loading: false });
      }
    },
  };

  useEffect(() => {
    let storage = config.accountStorage / 1073741824;
    if (storage > 1) {
      storage = Math.ceil(storage);
    }
    updateState({ host: config.domain, storage: storage });
    actions.getAccounts();
  }, []);

  return { state, actions };
}

