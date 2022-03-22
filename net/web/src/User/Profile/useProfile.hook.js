import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../AppContext/AppContext';
import { useNavigate } from "react-router-dom";

export function useProfile() {
  
  const [state, setState] = useState({
    name: '',
    handle: '',
    description: '',
    location: '',
    imageUrl: null
  });

  const navigate = useNavigate();
  const app = useContext(AppContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    close: () => {
      navigate('/user')
    },
  };

  useEffect(() => {
    if (app?.state?.Data?.profile) {
      let profile = app.state.Data.profile;
      if (profile.image != null) {
        updateState({ imageUrl: app.actions.profileImageUrl() })
      } else {
        updateState({ imageUrl: '' })
      }
      updateState({ name: profile.name });
      updateState({ handle: profile.handle });
      updateState({ description: profile.description });
      updateState({ location: profile.location });
    }
  }, [app])

  return { state, actions };
}
