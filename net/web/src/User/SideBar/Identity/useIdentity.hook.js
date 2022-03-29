import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../../AppContext/AppContext';
import { useNavigate } from "react-router-dom";

export function useIdentity() {
  
  const [state, setState] = useState({
    name: '',
    handle: '',
    domain: '',
    imageUrl: null,
    image: null,
  });

  const actions = {
    logout: async () => {
      app.actions.logout()
    },
    editLabels: () => {
      console.log("EDIT LABELS");
    },
    editProfile: () => {
      navigate('/user/profile');
    }
  };

  const navigate = useNavigate();
  const app = useContext(AppContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (app?.state?.Data?.profile) {
      let profile = app.state.Data.profile;
      updateState({ imageUrl: app.actions.profileImageUrl() })
      updateState({ image: profile.image });
      updateState({ name: profile.name });
      updateState({ handle: profile.handle });
      updateState({ domain: profile.node });
    }
  }, [app])

  return { state, actions };
}
