import { useState, useEffect, useRef, useContext } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { getListing } from 'api/getListing';
import { getListingImageUrl } from 'api/getListingImageUrl';

export function useRegistry(search, handle, server) {

  const [state, setState] = useState({
    accounts: [],
    searching: false,
  });

  const profile = useContext(ProfileContext);
  const debounce = useRef();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (debounce.current) {
      clearTimeout(debounce.current);
    }
    updateState({ searching: true });
    debounce.current = setTimeout(async () => {
      debounce.current = null;

      try {
        const accounts = handle ? await getListing(server, handle) : await getListing(server);
        const filtered = accounts.filter(item => {
          if (item.guid === profile.state.identity.guid) {
            return false;
          }
          return true;
        });
        const items = filtered.map(setAccountItem);
        updateState({ searching: false, accounts: items });
      }
      catch (err) {
        console.log(err);
        updateState({ searching: false, accounts: [] });
      }
    }, 1000);
  }, [handle, server]);

  const setAccountItem = (item) => {
    const { guid, name, handle, node, location, description, imageSet } = item;
    const server = node ? node : profile.state.server;
    const logo = imageSet ? getListingImageUrl(server, guid) : 'avatar';
    return { guid, name, handle, server, location, description, guid, imageSet, logo };
  };

  const actions = {};

  return { state, actions };
}
