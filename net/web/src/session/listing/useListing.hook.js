import { useContext, useState, useEffect } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { getListing } from 'api/getListing';

export function useListing() {

  const [state, setState] = useState({
    contacts: [],
    node: null,
    busy: false,
    disabled: true,
  });

  const profile = useContext(ProfileContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    onNode: (value) => {
      updateState({ node: value });
    },
    getListing: async () => {
      updateState({ busy: true });
      try {
        let contacts = await getListing(state.node);
console.log(contacts);
        let filtered = contacts.filter(contact => (contact.guid !== profile.state.profile.guid));
console.log(filtered);
        let sorted = filtered.sort((a, b) => {
          if (a?.name < b?.name) {
            return -1;
          }
          return 1;
        });
console.log(sorted);
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
    let node = profile?.state?.profile?.node;
    updateState({ disabled: node == null || node == '', node });
  }, [profile]);

  return { state, actions };
}
