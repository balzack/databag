import { useContext, useState, useEffect } from 'react';
import { ProfileContext } from 'context/ProfileContext';
import { useNavigate } from "react-router-dom";
import { getListing } from 'api/getListing';
import { getListingImageUrl } from 'api/getListingImageUrl';

export function useRegistry() {

  const [state, setState] = useState({
    server: '',
    busy: false,
    profiles: [],
  });

  const navigate = useNavigate();
  const profile = useContext(ProfileContext);
  
  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (profile?.state?.profile) {
      let identity = profile.state.profile;
      if (identity.node == null || identity.node == '') {
        updateState({ server: null });
      }
      else {
        updateState({ server: identity.node });
      }
    }
  }, [profile]);

  const actions = {
    setServer: (server) => {
      updateState({ server: server });
    },
    getRegistry: async () => {
      if (!state.busy && state.server != '') {
        updateState({ busy: true });
        try {
          let profiles = await getListing(state.server)
          updateState({ profiles: profiles.filter(contact => contact.guid !== profile.state.profile.guid) });
        }
        catch (err) {
          window.alert(err)
        }
        updateState({ busy: false });
      }
    },
    getRegistryImageUrl: (guid) => {
      return getListingImageUrl(state.server, guid);
    },
    select: (contact) => {
      navigate(`/user/contact/${contact.guid}`, { state: contact });
    }
  }

  return { state, actions };
}

