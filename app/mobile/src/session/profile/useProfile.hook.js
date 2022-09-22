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
  });

  const app = useContext(AppContext);
  const account = useContext(AccountContext);
  const profile = useContext(ProfileContext);
  const navigate = useNavigate();

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
    setEditHandle: (editHandle) => {
      updateState({ editHandle });
    },
    setEditPassword: (editPassword) => {
      updateState({ editPassword });
    },
    setEditConfirm: (editConfirm) => {
      updateState({ editConfirm });
    },
    saveDetails: () => {
      profile.actions.setProfileData(state.editName, state.editLocation, state.editDescription);
    },
  };

  return { state, actions };
}

