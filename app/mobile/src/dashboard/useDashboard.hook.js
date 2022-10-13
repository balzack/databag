import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';
import { getNodeStatus } from 'api/getNodeStatus';
import { setNodeStatus } from 'api/setNodeStatus';
import { getNodeConfig } from 'api/getNodeConfig';
import { getNodeAccounts } from 'api/getNodeAccounts';
import { getAccountImageUrl } from 'api/getAccountImageUrl';

export function useDashboard(config, server, token) {

  const [state, setState] = useState({
    config: null,
    accounts: [],
    editConfig: false,
    addUser: false,
    accessUser: false,
    accessId: null,
    hostname: null,
    storage: null,
  });

  const navigate = useNavigate();
  
  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const setAccountItem = (item) => {
    const { name, handle, imageSet, accountId } = item;   
 
    let logo;
    if (imageSet) {
      logo = getAccountImageUrl(server, token, accountId);
    }
    else {
      logo = 'avatar';
    }
    return { logo, name, handle, accountId };
  }

  const refreshAccounts = async () => {
    const accounts = await getNodeAccounts(server, token);
    updateState({ accounts: accounts.map(setAccountItem) });
  };

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
    showAddUser: () => {
      updateState({ addUser: true });
    },
    hideAddUser: () => {
      updateState({ addUser: false });
    },
    showAccessUser: (accessId) => {
      updateState({ accessUser: true, accountId: accessId });
    },
    hideAccessUser: () => {
      updateState({ accessUser: false });
    },
    setHostname: (hostname) => {
      updateState({ hostname });
    },
    setStorage: (storage) => {
      console.log(">>> ", storage, Number(storage.replace(/[^0-9]/g, '')));
      updateState({ storage: Number(storage.replace(/[^0-9]/g, '')) });
    },
  };

  return { state, actions };
}

