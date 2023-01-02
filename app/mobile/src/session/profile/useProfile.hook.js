import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWindowDimensions } from 'react-native';
import { ProfileContext } from 'context/ProfileContext';
import { AppContext } from 'context/AppContext';
import config from 'constants/Config';

export function useProfile() {

  const [state, setState] = useState({
    name: null,
    handle: null,
    node: null,
    showDelete: false,
    tabbed: null,
    confirmDelete: null,
    logginOut: false,
  });

  const app = useContext(AppContext);
  const dimensions = useWindowDimensions();
  const profile = useContext(ProfileContext);
  const navigate = useNavigate();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (dimensions.width > config.tabbedWidth) {
      updateState({ tabbed: false });
    }
    else {
      updateState({ tabbed: true });
    }
  }, [dimensions]);

  useEffect(() => {
    const { name, handle, node, location, description, image } = profile.state.identity;
    const imageSource = image ? profile.state.imageUrl : 'avatar';
    updateState({ name, handle, node, location, description, imageSource, editHandle: handle,
        editName: name, editLocation: location, editDescription: description });
  }, [profile]);

  useEffect(() => {
    const { disconnected, loggingOut } = app.state;
    updateState({ disconnected, loggingOut });
  }, [app]);

  const actions = {
    logout: async () => {
      await app.actions.logout();
      navigate('/');
    },
    remove: async () => {
      await app.actions.remove();
      updateState({ showDelete: false });
      navigate('/');
    },
    showDelete: () => {
      updateState({ showDelete: true });
    },
    hideDelete: () => {
      updateState({ showDelete: false });
    },
    setConfirmDelete: (confirmDelete) => {
      updateState({ confirmDelete });
    },
  };

  return { state, actions };
}

