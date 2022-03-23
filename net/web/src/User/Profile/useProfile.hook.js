import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../AppContext/AppContext';
import { useNavigate } from "react-router-dom";

export function useProfile() {
  
  const [state, setState] = useState({
    name: '',
    handle: '',
    description: '',
    location: '',
    imageUrl: null,
    modalBusy: false,
    modalName: '',
    modalLocation: '',
    modalDescription: '',
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
    setModalName: (value) => {
      updateState({ modalName: value });
    },
    setModalLocation: (value) => {
      updateState({ modalLocation: value });
    },
    setModalDescription: (value) => {
      updateState({ modalDescription: value });
    },
    setModalProfile: async () => {
      let set = false
      if(!state.modalBusy) {
        updateState({ modalBusy: true });
        try {
          await app.actions.setProfile(state.modalName, state.modalLocation, state.modalDescription);
          set = true
        }
        catch (err) {
          window.alert(err)
        }
        updateState({ modalBusy: false });
      }
      return set
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
      updateState({ modalName: profile.name });
      updateState({ handle: profile.handle });
      updateState({ description: profile.description });
      updateState({ modalDescription: profile.description });
      updateState({ location: profile.location });
      updateState({ modalLocation: profile.location });
    }
  }, [app])

  return { state, actions };
}
