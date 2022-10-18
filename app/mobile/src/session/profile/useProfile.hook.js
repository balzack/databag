import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWindowDimensions } from 'react-native';
import { ProfileContext } from 'context/ProfileContext';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';
import config from 'constants/Config';

export function useProfile() {

  const [state, setState] = useState({
    name: null,
    handle: null,
    location: null,
    description: null,
    node: null,
    imageSource: null,
    searchable: null,
    showDetailEdit: false,
    showLoginEdit: false,
    editName: null,
    editLocation: null,
    editDescription: null,
    editHandle: null,
    editPassword: null,
    editConfirm: null,
    checked: true,
    available: true,
    showPassword: false,
    showConfirm: false,
    blockedChannels: false,
    blockedCards: false,
    blockedMessages: false,
    tabbed: null,
    disconnected: false,
  });

  const app = useContext(AppContext);
  const dimensions = useWindowDimensions();
  const account = useContext(AccountContext);
  const profile = useContext(ProfileContext);
  const navigate = useNavigate();
  const debounce = useRef(null);

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
    const { name, handle, node, location, description, image } = profile.state.profile;
    const imageSource = image ? profile.state.imageUrl : 'avatar';
    updateState({ name, handle, node, location, description, imageSource, editHandle: handle,
        editName: name, editLocation: location, editDescription: description });
  }, [profile]);

  useEffect(() => {
    updateState({ searchable: account.state.status.searchable });
  }, [account]);

  useEffect(() => {
    const { disconnected } = app.state;
    updateState({ disconnected });
  }, [app]);

  const actions = {
    logout: () => {
      app.actions.logout();
      navigate('/');
    },
    setVisible: async (searchable) => {
      updateState({ searchable });
      await account.actions.setSearchable(searchable);
    },
    setProfileImage: async (data) => {
      await profile.actions.setProfileImage(data);
    },
    showBlockedChannels: () => {
      updateState({ blockedChannels: true });
    },
    hideBlockedChannels: () => {
      updateState({ blockedChannels: false });
    },
    showBlockedCards: () => {
      updateState({ blockedCards: true });
    },
    hideBlockedCards: () => {
      updateState({ blockedCards: false });
    },
    showBlockedMessages: () => {
      updateState({ blockedMessages: true });
    },
    hideBlockedMessages: () => {
      updateState({ blockedMessages: false });
    },
    showLoginEdit: () => {
      updateState({ showLoginEdit: true });
    },
    hideLoginEdit: () => {
      updateState({ showLoginEdit: false });
    },
    showDetailEdit: () => {
      updateState({ showDetailEdit: true });
    },
    hideDetailEdit: () => {
      updateState({ showDetailEdit: false });
    },
    setEditName: (editName) => {
      updateState({ editName });
    },
    setEditLocation: (editLocation) => {
      updateState({ editLocation });
    },
    setEditDescription: (editDescription) => {
      updateState({ editDescription });
    },
    showPassword: () => {
      updateState({ showPassword: true });
    },
    hidePassword: () => {
      updateState({ showPassword: false });
    },
    showConfirm: () => {
      updateState({ showConfirm: true });
    },
    hideConfirm: () => {
      updateState({ showConfirm: false });
    },
    setEditHandle: (editHandle) => {
      updateState({ editHandle, checked: false });

      if (debounce.current != null) {
        clearTimeout(debounce.current);
      }
      debounce.current = setTimeout(async () => {
        try {
          if (editHandle === state.handle) {
            updateState({ available: true, checked: true });
          }
          else {
            const available = await profile.actions.getHandle(editHandle);
            updateState({ available, checked: true });
          }
        }
        catch (err) {
          console.log(err);
        }
      }, 1000);
    },
    setEditPassword: (editPassword) => {
      updateState({ editPassword });
    },
    setEditConfirm: (editConfirm) => {
      updateState({ editConfirm });
    },
    saveDetails: async () => {
      await profile.actions.setProfileData(state.editName, state.editLocation, state.editDescription);
    },
    saveLogin: async () => {
      await account.actions.setLogin(state.editHandle, state.editPassword);
    },
  };

  return { state, actions };
}

