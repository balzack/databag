import { useContext, useState, useEffect } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { ViewportContext } from 'context/ViewportContext';
import { getListing } from 'api/getListing';

export function useListing() {

  const [state, setState] = useState({
    contacts: [],
    node: null,
    busy: false,
    disabled: true,
    display: null,
    showFilter: false,
    username: null,
  });

  const profile = useContext(ProfileContext);
  const viewport = useContext(ViewportContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ contacts: [] });
  }, [state.node]);

  const actions = {
    showFilter: () => {
      updateState({ showFilter: true });
    },
    hideFilter: () => {
      updateState({ showFilter: false });
    },
    setUsername: (username) => {
      updateState({ username });
    },
    onNode: (value) => {
      updateState({ node: value });
    },
    getListing: async () => {
      updateState({ busy: true });
      try {
        let contacts = await getListing(state.node, state.username);
        let filtered = contacts.filter(contact => (contact.guid !== profile.state.identity.guid));
        let sorted = filtered.sort((a, b) => {
          if (a?.name < b?.name) {
            return -1;
          }
          return 1;
        });
        updateState({ busy: false, contacts: sorted });
      }
      catch (err) {
        console.log(err);
        updateState({ busy: false });
        throw new Error("failed to list contacts");
      }
    },
  };

  useEffect(() => {
    let node = profile?.state?.identity?.node;
    updateState({ disabled: node == null || node === '', node });
  }, [profile]);

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  return { state, actions };
}
