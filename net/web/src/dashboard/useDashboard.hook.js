import { useContext, useRef, useState, useEffect } from 'react';
import { setNodeConfig } from 'api/setNodeConfig';
import { getNodeAccounts } from 'api/getNodeAccounts';
import { removeAccount } from 'api/removeAccount';
import { addAccountCreate } from 'api/addAccountCreate';
import { useNavigation, useLocation } from 'react-router-dom';

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

  const navigate = useNavigation();
  const location = useLocation();
  const token = useRef();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setCreateLink: async () => {
      if (!state.createBusy) {
        updateState({ busy: true });
        try {
          const create = await addAccountCreate(token.current)
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
    setSettings: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          const { domain, keyType, accountStorage, pushSupported, enableImage, enableAudio, enableVideo } = state;
          const storage = accountStorage * 1073741824;
          const config = { domain,  accountStorage: storage, keyType, enableImage, enableAudio, enableVideo, pushSupported };
          await setNodeConfig(token.current, config);
          updateState({ busy: false, showSettings: false });
        }
        catch(err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error("failed to set settings");
        }
      }
    },
    getAccounts: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          let accounts = await getNodeAccounts(token.current);
          accounts.sort((a, b) => {
            if (a.handle < b.handle) {
              return -1;
            }
            if (a.handle > b.handle) {
              return 1;
            }
            return 0;
          });
          updateState({ busy: false, accounts });
        }
        catch(err) {
          console.log(err);
          updateState({ busy: false, errorMessage: 'failed to load accounts' });
        }
      }
    },
  };

  useEffect(() => {
    const params = new URLSearchParams(location);
    const pass = params.get("pass");
    if (!pass) {
      navigate('/admin');
    }
    else {
      token.current = pass;
      const config = JSON.parse(params.get("config"));
      const { storage, domain, keyType, pushSupported, enableImage, enableAudio, enableVideo } = config;
      const accountStorage = Math.ceil(accountStorage / 1073741824);
      updateState({ domain, accountStorage, keyType, enableImage, enableAudio, enableVideo, pushSupported });
      actions.getAccounts();
    }
  }, []);
      
  return { state, actions };
}

