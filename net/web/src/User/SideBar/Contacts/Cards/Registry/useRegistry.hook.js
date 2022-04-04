import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../../../../AppContext/AppContext';
import { useNavigate } from "react-router-dom";

export function useRegistry() {

  const [state, setState] = useState({
    server: '',
    busy: false,
    profiles: [],
  });

  const navigate = useNavigate();
  const app = useContext(AppContext);
  
  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (app?.state?.Data?.profile) {
      let profile = app.state.Data.profile;
      updateState({ server: profile.node });
    }
  }, [app]);

  const actions = {
    setServer: (server) => {
      updateState({ server: server });
    },
    getRegistry: async () => {
      if (!state.busy && state.server != '') {
        updateState({ busy: true });
        try {
          let profiles = await app.actions.getRegistry(state.server)
          updateState({ profiles: profiles });
        }
        catch (err) {
          window.alert(err)
        }
        updateState({ busy: false });
      }
    },
    getRegistryImageUrl: (guid, revision) => {
      if (app?.actions?.getRegistryImageUrl) {
        return app.actions.getRegistryImageUrl(state.server, guid, revision);
      }
      return null;
    },
    select: (contact) => {
      navigate(`/user/contact/${contact.guid}`, { state: contact });
    }
  }

  return { state, actions };
}

