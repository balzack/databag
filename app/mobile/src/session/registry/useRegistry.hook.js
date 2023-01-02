import { useState, useEffect, useRef, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from 'context/ProfileContext';
import { getListing } from 'api/getListing';
import { getListingImageUrl } from 'api/getListingImageUrl';
import config from 'constants/Config';

export function useRegistry() {

  const [state, setState] = useState({
    tabbed: null,
    accounts: [],
    server: null,
    filter: false,
    username: null,
    searched: false,
    busy: false,
  });

  const dimensions = useWindowDimensions();
  const profile = useContext(ProfileContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (dimensions.width > config.tabbedWidth) {
      updateState({ tabbed: false });
    }
    else {
      updateState({ tabbed: true });
    }
  }, [dimensions]);

  useEffect(() => {
    const server = profile.state.identity.node;
    updateState({ server });  
    getAccounts(server, true);
  }, [profile]);

  const setAccountItem = (item) => {
    const { guid, name, handle, node, location, description } = item;
    const logo = item.imageSet ? getListingImageUrl(node, guid) : 'avatar';
    return { guid, name, handle, node, location, description, guid, logo };
  };

  const getAccounts = async (server, ignore) => {
    if (!state.busy) {
      try {
        updateState({ busy: true });
        let accounts;
        if (state.filter && state.username) {
          accounts = await getListing(server, state.username);
        }
        else {
          accounts = await getListing(server);
        }
        const filtered = accounts.filter(item => {
          if (item.guid === profile.state.identity.guid) {
            return false;
          }
          return true;
        });
        const items = filtered.map(setAccountItem);
        updateState({ busy: false, searched: true, accounts: items });
      }
      catch (err) {
        console.log(err);
        updateState({ busy: false, accounts: [] });
        if (!ignore) {
          throw new Error('failed list accounts');
        }
      }
    }
  };    

  const actions = {
    setServer: (server) => {
      updateState({ server, searched: false, accounts: [] });
    },
    search: async () => {
      await getAccounts(state.server, false);
    },
    filter: async () => {
      updateState({ filter: true });
    },
    setUsername: async (username) => {
      updateState({ username });
    },
  };

  return { state, actions };
}

