import { useState, useEffect, useContext } from 'react';
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

export function useDashboard(config, server, token) {

  const [state, setState] = useState({
    config: null,
    accounts: [],
    editConfig: false,
    addUser: false,
    accessUser: false,
    accessId: null,
    domain: null,
    storage: null,
    keyType: null,
    enableImage: true,
    enableAudio: true,
    enableVideo: true,
    createToken: null,
    enableIce: false,
    iceUrl: null,
    iceUsername: null,
    icePassword: null,
  });

  const navigate = useNavigate();
  
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
    const { keyType, accountStorage, domain, enableImage, enableAudio, enableVideo, pushSupported, enableIce, iceUrl, iceUsername, icePassword } = config;
    updateState({ keyType, storage: accountStorage.toString(), domain, enableImage, enableAudio, enableVideo, pushSupported, enableIce, iceUrl, iceUsername, icePassword });
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
      updateState({ storage: Number(storage.replace(/[^0-9]/g, '')) });
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
      const { storage, domain, keyType, enableImage, enableAudio, enableVideo, enableIce, iceUrl, iceUsername, icePassword } = state;
      const config = { accountStorage: Number(storage), domain, keyType, enableImage, enableAudio, enableVideo, enableIce, iceUrl, iceUsername, icePassword };
      await setNodeConfig(server, token, config);
    },
    enableUser: async (accountId, enabled) => {
      await setAccountStatus(server, token, accountId, !enabled);
      await refreshAccounts();
    },
    removeUser: async (accountId) => {
      await removeAccount(server, token, accountId);
      await refreshAccounts();
    },
  };

  return { state, actions };
}

