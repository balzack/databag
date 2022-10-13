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
  };

  return { state, actions };
}

