import { useContext, useState, useEffect } from 'react';
import { getNodeConfig } from 'api/getNodeConfig';
import { setNodeConfig } from 'api/setNodeConfig';
import { getNodeAccounts } from 'api/getNodeAccounts';
import { removeAccount } from 'api/removeAccount';
import { addAccountCreate } from 'api/addAccountCreate';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';
import { SettingsContext } from 'context/SettingsContext';

import { getAdminMFAuth } from 'api/getAdminMFAuth';
import { addAdminMFAuth } from 'api/addAdminMFAuth';
import { setAdminMFAuth } from 'api/setAdminMFAuth';
import { removeAdminMFAuth } from 'api/removeAdminMFAuth';

export function useDashboard(token) {

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
    enableBinary: null,
    enableIce: null,
    iceService: null,
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

    mfaModal: false,
    mfAuthSet: false,
    mfAuthEnabled: false,
    mfAuthSecretText: null,
    mfAuthSecretImage: null,
    mfaAuthError: null,
    mfaCode: '',
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
    setEnableBinary: (enableBinary) => {
      updateState({ enableBinary });
    },
    setEnableIce: (enableIce) => {
      updateState({ enableIce });
    },
    setIceService: (iceService) => {
      const iceUrl = iceService ? 'https://rtc.live.cloudflare.com/v1/turn/keys/%%TURN_KEY_ID%%/credentials/generate' : '';
      updateState({ iceService, iceUrl });
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
    setCode: async (code) => {
      updateState({ mfaCode: code });
    },
    enableMFA: async () => {
      const mfa = await addAdminMFAuth(app.state.adminToken);
      updateState({ mfaModal: true, mfaError: false, mfaText: mfa.secretText, mfaImage: mfa.secretImage, mfaCode: '' });
    },
    disableMFA: async () => {
      await removeAdminMFAuth(app.state.adminToken);
      updateState({ mfaAuthEnabled: false });
    },
    confirmMFA: async () => {
      try {
        await setAdminMFAuth(app.state.adminToken, state.mfaCode);
        updateState({ mfaAuthEnabled: true, mfaModal: false });
      }
      catch (err) {
        const msg = err?.message;
        updateState({ mfaError: msg });
      }
    },
    dismissMFA: async () => {
      updateState({ mfaModal: false });
    },
    setSettings: async () => {
      if (!state.busy) {
        updateState({ busy: true });
        try {
          const { domain, keyType, accountStorage, pushSupported, transformSupported, allowUnsealed, enableImage, enableAudio, enableVideo, enableBinary, enableIce, iceService, iceUrl, iceUsername, icePassword, enableOpenAccess, openAccessLimit } = state;
          const storage = accountStorage * 1073741824;
          const config = { domain,  accountStorage: storage, keyType, enableImage, enableAudio, enableVideo, enableBinary, pushSupported, transformSupported, allowUnsealed, enableIce, iceService, iceUrl, iceUsername, icePassword, enableOpenAccess, openAccessLimit };
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
      const enabled = await getAdminMFAuth(app.state.adminToken);
      const config = await getNodeConfig(app.state.adminToken);
      const { accountStorage, domain, keyType, pushSupported, transformSupported, allowUnsealed, enableImage, enableAudio, enableVideo, enableBinary, enableIce, iceService, iceUrl, iceUsername, icePassword, enableOpenAccess, openAccessLimit } = config;
      const storage = Math.ceil(accountStorage / 1073741824);
      updateState({ mfAuthSet: true, mfaAuthEnabled: enabled, configError: false, domain, accountStorage: storage, keyType, enableImage, enableAudio, enableVideo, enableBinary, pushSupported, transformSupported, allowUnsealed, enableIce, iceService, iceUrl, iceUsername, icePassword, enableOpenAccess, openAccessLimit });
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

