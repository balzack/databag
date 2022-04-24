import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../../AppContext/AppContext';
import { ProfileContext } from '../../../AppContext/ProfileContext';
import { useNavigate } from "react-router-dom";

export function useIdentity() {
  
  const [state, setState] = useState({
    name: '',
    handle: '',
    domain: '',
    imageUrl: null,
    image: null,
  });

  const navigate = useNavigate();
  const profile = useContext(ProfileContext);
  const app = useContext(AppContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

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

  useEffect(() => {
    if (profile?.state?.profile) {
      let identity = profile.state.profile;
      updateState({ imageUrl: profile.actions.profileImageUrl() })
      updateState({ image: identity.image });
      updateState({ name: identity.name });
      updateState({ handle: identity.handle });
      updateState({ domain: identity.node });
    }
  }, [profile])

  return { state, actions };
}
