import { useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';
import { getNodeStatus } from 'api/getNodeStatus';
import { setNodeStatus } from 'api/setNodeStatus';
import { getNodeConfig } from 'api/getNodeConfig';
import { setNodeConfig } from 'api/setNodeConfig';
import { getNodeAccounts } from 'api/getNodeAccounts';
import { getAccountImageUrl } from 'api/getAccountImageUrl';
import { removeAccount } from 'api/removeAccount';
import { addAccountCreate } from 'api/addAccountCreate';
import { setAccountStatus } from 'api/setAccountStatus';
import { addAccountAccess } from 'api/addAccountAccess';
import { DisplayContext } from 'context/DisplayContext';
import { getLanguageStrings } from 'constants/Strings';

export function useDashboard(config, server, token) {

  const [state, setState] = useState({
    strings: getLanguageStrings(),
    config: null,
    accounts: [],
    editConfig: false,
    addUser: false,
    accessUser: false,
    accessId: null,
    domain: null,
    storage: null,
    keyType: null,
    pushSupported: true,
    allowUnsealed: false,
    tranformSupported: false,
    enableImage: true,
    enableAudio: true,
    enableVideo: true,
    enableBinary: true,
    createToken: null,
    enableIce: false,
    iceUrl: null,
    iceUsername: null,
    icePassword: null,
  });

  const navigate = useNavigate();
  const display = useContext(DisplayContext);
  
  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const setAccountItem = (item) => {
    const { name, handle, imageSet, accountId, disabled } = item;   
 
    let logo;
    if (imageSet) {
      logo = getAccountImageUrl(server, token, accountId);
    }
    else {
      logo = 'avatar';
    }
    return { logo, name, handle, accountId, disabled };
  }

  const refreshAccounts = async () => {
    const accounts = await getNodeAccounts(server, token);
    updateState({ accounts: accounts.map(setAccountItem) });
  };

  useEffect(() => {
    const { keyType, accountStorage, domain, enableImage, enableAudio, enableVideo, enableBinary, transformSupported, allowUnsealed, pushSupported, enableIce, iceUrl, iceUsername, icePassword } = config;
    const storage = Math.ceil(accountStorage / 1073741824);
    updateState({ keyType, storage: storage.toString(), domain, enableImage, enableAudio, enableVideo, enableBinary, transformSupported, allowUnsealed, pushSupported, enableIce, iceUrl, iceUsername, icePassword });
  }, [config]);

  useEffect(() => {
    refreshAccounts();
  }, []);

  const actions = {
    logout: () => {
      navigate('/admin');
    },
    refresh: () => {
      refreshAccounts();
    },
    showEditConfig: () => {
      updateState({ editConfig: true });
    },
    hideEditConfig: () => {
      updateState({ editConfig: false });
    },
    addUser: async () => {
      const createToken = await addAccountCreate(server, token);
      updateState({ addUser: true, createToken });
    },
    hideAddUser: () => {
      updateState({ addUser: false });
    },
    accessUser: async (accountId) => {
      const accessToken = await addAccountAccess(server, token, accountId);
      updateState({ accessUser: true, accessToken });
    },
    hideAccessUser: () => {
      updateState({ accessUser: false });
    },
    setDomain: (domain) => {
      updateState({ domain });
    },
    setStorage: (storage) => {
      updateState({ storage: storage.replace(/[^0-9]/g, '') });
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
    setKeyType: (keyType) => {
      updateState({ keyType });
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
    saveConfig: async () => {
      const { storage, domain, keyType, enableImage, pushSupported, allowUnsealed, transformSupported, enableAudio, enableVideo, enableBinary, enableIce, iceUrl, iceUsername, icePassword } = state;
      const accountStorage = Number(storage) * 1073741824;
      const config = { accountStorage, domain, keyType, enableImage, pushSupported, allowUnsealed, transformSupported, enableAudio, enableVideo, enableBinary, enableIce, iceUrl, iceUsername, icePassword };
      await setNodeConfig(server, token, config);
    },
    enableUser: async (accountId, enabled) => {
      await setAccountStatus(server, token, accountId, !enabled);
      await refreshAccounts();
    },
    promptRemove: (accountId) => {
      display.actions.showPrompt({
        title: 'Delete User',
        ok: { label: 'Delete', action: async () => {
            await removeAccount(server, token, accountId);
            await refreshAccounts();
          } , failed: () => {
          Alert.alert(
            state.strings.error,
            state.strings.tryAgain,
          );
        }},
        cancel: { label: state.strings.cancel },
      });
    },
  };

  return { state, actions };
}

