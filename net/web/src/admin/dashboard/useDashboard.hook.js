import { useState, useEffect } from 'react';
import { setNodeConfig } from 'api/setNodeConfig';
import { getNodeAccounts } from 'api/getNodeAccounts';
import { removeAccount } from 'api/removeAccount';
import { addAccountCreate } from 'api/addAccountCreate';

export function useDashboard(token, config) {

  const [state, setState] = useState({
    domain: "",
    accountStorage: null,
    keyType: null,
    enableImage: null,
    enableAudio: null,
    enableVideo: null,
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
    setHost: (domain) => {
      updateState({ domain });
    },
    setStorage: (accountStorage) => {
      updateState({ accountStorage });
    },
    setKeyType: (keyType) => {
      updateState({ keyType });
    },
    setEnableImage: (enableImage) => {
      updateState({ enableImage });
    },
    setEnableAudio: (enableAudio) => {
      updateState({ enableAudio });
    },
    setEnableVideo: (enableVideo) => {
      updateState({ enableVideo });
    },
    setShowSettings: (value) => {
      updateState({ showSettings: value });
    },
    setSettings: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          const { domain, keyType, accountStorage, enableImage, enableAudio, enableVideo } = state;
          await setNodeConfig(token,
            { domain,  accountStorage: accountStorage * 1073741824,
                keyType, enableImage, enableAudio, enableVideo });
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
    const { accountStorage, domain, keyType, enableImage, enableAudio, enableVideo } = config;
    updateState({ domain, accountStorage: Math.ceil(accountStorage / 1073741824), keyType,
      enableImage, enableAudio, enableVideo });
    actions.getAccounts();
    // eslint-disable-next-line
  }, [config]);

  return { state, actions };
}

