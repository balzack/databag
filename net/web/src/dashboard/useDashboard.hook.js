import { useContext, useRef, useState, useEffect } from 'react';
import { getNodeConfig } from 'api/getNodeConfig';
import { setNodeConfig } from 'api/setNodeConfig';
import { getNodeAccounts } from 'api/getNodeAccounts';
import { removeAccount } from 'api/removeAccount';
import { addAccountCreate } from 'api/addAccountCreate';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';

export function useDashboard() {

  const [state, setState] = useState({
    domain: "",
    accountStorage: null,
    keyType: null,
    pushSupported: null,
    enableImage: null,
    enableAudio: null,
    enableVideo: null,

    errorMessage: null,
    createToken: null,
    showSettings: false,
    showCreate: false,
    busy: false,
    accounts: [],
  });

console.log("HERE1");
  const navigate = useNavigate();
console.log("HERE2");
  const app = useContext(AppContext);
console.log("HERE4");

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (!app.state.adminToken) {
      navigate('/admin');
    }
    else {
      syncConfig();
      syncAccounts();
    }
  }, [app]);

  const actions = {
    setCreateLink: async () => {
      if (!state.createBusy) {
        updateState({ busy: true });
        try {
          const create = await addAccountCreate(app.state.adminToken)
          updateState({ createToken: create, showCreate: true });
        }
        catch (err) {
          window.alert(err);
        }
        updateState({ busy: false });
      }
    },
    setShowCreate: (showCreate) => {
      updateState({ showCreate });
    },
    removeAccount: async (accountId) => {
      await removeAccount(app.state.adminToken, accountId);
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
    setPushSupported: (pushSupported) => {
      updateState({ pushSupported });
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
    logout: () => {
      app.actions.clearAdmin();
    },
    getAccounts: async () => {
      await syncAccounts();
    },
    setSettings: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          const { domain, keyType, accountStorage, pushSupported, enableImage, enableAudio, enableVideo } = state;
          const storage = accountStorage * 1073741824;
          const config = { domain,  accountStorage: storage, keyType, enableImage, enableAudio, enableVideo, pushSupported };
          await setNodeConfig(app.state.adminToken, config);
          updateState({ busy: false, showSettings: false });
        }
        catch(err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error("failed to set settings");
        }
      }
    },
  };

  const syncConfig = async () => {
    try {
      const config = await getNodeConfig(app.state.adminToken);
      const { storage, domain, keyType, pushSupported, enableImage, enableAudio, enableVideo } = config;
      const accountStorage = Math.ceil(storage / 1073741824);
      updateState({ domain, accountStorage, keyType, enableImage, enableAudio, enableVideo, pushSupported });
    }
    catch(err) {
      console.log(err);
      updateState({ errorMessage: 'failed to sync config' });
    }
  };

  const syncAccounts = async () => {
    try {
      const accounts = await getNodeAccounts(app.state.adminToken);
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
      updateState({ errorMessage: 'failed to sync accounts' });
    }
  };

  return { state, actions };
}

