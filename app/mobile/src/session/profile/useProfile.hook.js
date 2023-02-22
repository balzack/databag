import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from 'context/ProfileContext';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';

export function useProfile() {

  const [state, setState] = useState({
    name: null,
    handle: null,
    editHandle: null,
    location: null,
    editLocation: null,
    description: null,
    editDescritpion: null,
    node: null,
    showDelete: false,
    editDetails: false,
    editLogin: false,
    editSeal: false,
    confirmDelete: null,
    blockedChannels: false,
    blockedCards: false,
    blockedMessages: false,
    logginOut: false,
    disconnected: false,
  });

  const app = useContext(AppContext);
  const account = useContext(AccountContext);
  const profile = useContext(ProfileContext);
  const navigate = useNavigate();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { name, handle, node, location, description, image } = profile.state.identity;
    const imageSource = image ? profile.state.imageUrl : 'avatar';
    updateState({ name, handle, node, location, description, imageSource, editHandle: handle,
        editName: name, editLocation: location, editDescription: description });
  }, [profile.state]);

  useEffect(() => {
    const { sealable } = account.state.status || {};
    updateState({ sealable });
  }, [account.state]);

  useEffect(() => {
    const { loggingOut, status } = app.state;
    updateState({ loggingOut, disconnected: status === 'disconnected' });
  }, [app.state]);

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
      updateState({ showDelete: true, confirmDelete: null });
    },
    hideDelete: () => {
      updateState({ showDelete: false });
    },
    setConfirmDelete: (confirmDelete) => {
      updateState({ confirmDelete });
    },
    showEditDetails: () => {
      updateState({ editDetails: true });
    },
    hideEditDetails: () => {
      updateState({ editDetails: false });
    },
    showEditLogin: () => {
      updateState({ editLogin: true });
    },
    hideEditLogin: () => {
      updateState({ editLogin: false });
    },
    showEditSeal: () => {
      updateState({ editSeal: true });
    },
    hideEditSeal: () => {
      updateState({ editSeal: false });
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
    setEditName: (editName) => {
      updateState({ editName });
    },
    setEditLocation: (editLocation) => {
      updateState({ editLocation });
    },
    setEditDescription: (editDescription) => {
      updateState({ editDescription });
    },
  };

  return { state, actions };
}


