import { useContext, useState, useEffect } from 'react';
import { getNodeConfig } from 'api/getNodeConfig';
import { setNodeConfig } from 'api/setNodeConfig';
import { getNodeAccounts } from 'api/getNodeAccounts';
import { removeAccount } from 'api/removeAccount';
import { addAccountCreate } from 'api/addAccountCreate';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';
import { SettingsContext } from 'context/SettingsContext';

export function useDashboard() {

  const [state, setState] = useState({
    domain: "",
    accountStorage: null,
    keyType: null,
    pushSupported: null,
    allowUnsealed: null,
    transformSupported: false,
    enableImage: null,
    enableAudio: null,
    enableVideo: null,
    enableIce: null,
    iceUrl: null,
    iceUsername: null,
    icePassword: null,
    enableOpenAccess: null,
    openAccessLimit: null,

    configError: false,
    accountsError: false,
    createToken: null,
    showSettings: false,
    showCreate: false,
    busy: false,
    accounts: [],
    colors: {},
    menuStyle: {},
    strings: {},
  });

  const navigate = useNavigate();
  const app = useContext(AppContext);
  const settings = useContext(SettingsContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (!app.state.adminToken) {
      navigate('/');
    }
    else {
      syncConfig();
      syncAccounts();
    }
    // eslint-disable-next-line
  }, [app]);

  useEffect(() => {
    const { strings, colors, menuStyle } = settings.state;
    updateState({ strings, colors, menuStyle });
  }, [settings.state]);

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
      syncAccounts();
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
    setAllowUnsealed: (allowUnsealed) => {
      updateState({ allowUnsealed });
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
    setEnableIce: (enableIce) => {
      updateState({ enableIce });
    },
    setIceUrl: (iceUrl) => {
      updateState({ iceUrl });
    },
    setIceUsername: (iceUsername) => {
      updateState({ iceUsername });
    },
    setIcePassword: (icePassword) => {
      updateState({ icePassword });
    },
    setEnableOpenAccess: (enableOpenAccess) => {
      updateState({ enableOpenAccess });
    },
    setOpenAccessLimit: (openAccessLimit) => {
      updateState({ openAccessLimit });
    },
    setShowSettings: (value) => {
      updateState({ showSettings: value });
    },
    logout: () => {
      app.actions.clearAdmin();
    },
    reload: async () => {
      await syncConfig();
      await syncAccounts();
    },
    setSettings: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          const { domain, keyType, accountStorage, pushSupported, transformSupported, allowUnsealed, enableImage, enableAudio, enableVideo, enableIce, iceUrl, iceUsername, icePassword, enableOpenAccess, openAccessLimit } = state;
          const storage = accountStorage * 1073741824;
          const config = { domain,  accountStorage: storage, keyType, enableImage, enableAudio, enableVideo, pushSupported, transformSupported, allowUnsealed, enableIce, iceUrl, iceUsername, icePassword, enableOpenAccess, openAccessLimit };
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
      const { storage, domain, keyType, pushSupported, transformSupported, allowUnsealed, enableImage, enableAudio, enableVideo, enableIce, iceUrl, iceUsername, icePassword, enableOpenAccess, openAccessLimit } = config;
      const accountStorage = Math.ceil(storage / 1073741824);
      updateState({ configError: false, domain, accountStorage, keyType, enableImage, enableAudio, enableVideo, pushSupported, transformSupported, allowUnsealed, enableIce, iceUrl, iceUsername, icePassword, enableOpenAccess, openAccessLimit });
    }
    catch(err) {
      console.log(err);
      updateState({ configError: true });
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
      updateState({ accounstError: false, accounts });
    }
    catch(err) {
      console.log(err);
      updateState({ accountsError: true });
    }
  };

  return { state, actions };
}

