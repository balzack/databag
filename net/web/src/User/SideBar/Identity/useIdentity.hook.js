import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../../AppContext/AppContext';

export function useIdentity() {
  
  const [state, setState] = useState({
    name: '',
    handle: '',
    domain: '',
    imageUrl: ''
  });

  const actions = {
    logout: async () => {
      app.actions.logout()
    }
  };

  const app = useContext(AppContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (app?.state?.Data?.profile) {
      let profile = app.state.Data.profile;
      if (profile.name != null) {
        updateState({ name: profile.name });
      }
      if (profile.image != null) {
        updateState({ imageUrl: 'https://' + profile.node + '/profile/image?token=' + app.state.token })
      } else {
        updateState({ imageUrl: '' })
      }
      updateState({ handle: profile.handle });
      updateState({ domain: profile.node });
    }
  }, [app])

  return { state, actions };
}
