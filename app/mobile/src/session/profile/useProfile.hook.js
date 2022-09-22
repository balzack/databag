import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from 'context/ProfileContext';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';

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
  });

  const app = useContext(AppContext);
  const account = useContext(AccountContext);
  const profile = useContext(ProfileContext);
  const navigate = useNavigate();
  const debounce = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { name, handle, node, location, description, image } = profile.state.profile;
    const imageSource = image ? profile.state.imageUrl : 'avatar';
    updateState({ name, handle, node, location, description, imageSource, editHandle: handle,
        editName: name, editLocation: location, editDescription: description });
  }, [profile]);

  useEffect(() => {
    updateState({ searchable: account.state.status.searchable });
  }, [account]);

  const actions = {
    logout: () => {
      app.actions.logout();
      navigate('/');
    },
    setVisible: async (visible) => {
      await account.actions.setSearchable(visible);
    },
    setProfileImage: async (data) => {
      await profile.actions.setProfileImage(data);
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

