import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from 'context/ProfileContext';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';
import { generateSeal, updateSeal, unlockSeal } from 'context/sealUtil';

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
    pushEnabled: false,
    searchable: false,
    sealableFalse: false,
    editPassword: null,
    editConfirm: null,
    showPassword: false,
    showConfirm: false,
    saving: false,
    checked: true,
    available: true,

    seal: null,
    sealKey: null,
    sealEnabled: false,
    sealUnlocked: false,
    sealMode: null,
    sealUnlock: null,
    sealPassword: null,
    sealConfirm: null,
    sealDelete: null,
    canSaveSeal: false,
    showSealUnlock: false,
    showSealConfirm: false,
    showSealPassword: false,
  });

  const app = useContext(AppContext);
  const account = useContext(AccountContext);
  const profile = useContext(ProfileContext);
  const navigate = useNavigate();

  const debounce = useRef();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const unlock = async () => {
    const sealKey = unlockSeal(state.seal, state.sealUnlock);
    await account.actions.unlockAccountSeal(sealKey);
  };

  const forget = async () => {
    await account.actions.unlockAccountSeal({});
  }

  const update = async () => {
    const updated = updateSeal(state.seal, state.sealKey, state.sealPassword);
    await account.actions.setAccountSeal(updated.seal, updated.sealKey);
  }

  const enable = async () => {
    const created = await generateSeal(state.sealPassword);
    await account.actions.setAccountSeal(created.seal, created.sealKey);
  }

  const disable = async () => {
    await account.actions.setAccountSeal({}, {});
  }

  useEffect(() => {
    if (state.sealMode === 'unlocked') {
      return updateState({ canSaveSeal: true });
    }
    if (state.sealMode === 'unlocking' && state.sealUnlock != null && state.sealUnlock !== '') {
      return updateState({ canSaveSeal: true });
    }
    if (state.sealMode === 'enabling' && state.sealPassword != null && state.sealPassword === state.sealConfirm) {
      return updateState({ canSaveSeal: true });
    }
    if (state.sealMode === 'disabling' && state.sealDelete === 'delete') {
      return updateState({ canSaveSeal: true });
    }
    if (state.sealMode === 'updating' && state.sealPassword != null && state.sealPassword === state.sealConfirm) {
      return updateState({ canSaveSeal: true });
    }
    updateState({ canSaveSeal: false });
  }, [state.sealMode, state.sealable, state.sealUnlock, state.sealPassword, state.sealConfirm, state.sealDelete]);
 
  useEffect(() => {
    const { name, handle, node, location, description, image } = profile.state.identity;
    const imageSource = image ? profile.state.imageUrl : 'avatar';
    updateState({ name, handle, node, location, description, imageSource, editHandle: handle,
        editName: name, editLocation: location, editDescription: description });
  }, [profile.state]);

  useEffect(() => {
    const { searchable, pushEnabled, seal, sealable } = account.state.status;
    const sealKey = account.state.sealKey;
    const sealEnabled = seal?.publicKey != null;
    const sealUnlocked = seal?.publicKey === sealKey?.public && sealKey?.private && sealKey?.public;
    updateState({ searchable, sealable, pushEnabled, seal, sealKey, sealEnabled, sealUnlocked });
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
      updateState({ editLogin: true, editPassword: null, editConfirm: null });
    },
    hideEditLogin: () => {
      updateState({ editLogin: false });
    },
    showEditSeal: () => {
      let sealMode = null;
      const sealable = state.sealEnabled;
      if (state.sealEnabled && !state.sealUnlocked) {
        sealMode = 'unlocking';
      }
      else if (state.sealEnabled && state.sealUnlocked) {
        sealMode = 'unlocked';
      }
      else {
        sealMode = 'disabled';
      }
      updateState({ editSeal: true, sealMode, sealUnlock: null, sealPassword: null, sealConfirm: null, sealDelete: null });
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
    setSealUnlock: (sealUnlock) => {
      updateState({ sealUnlock });
    },
    setSealPassword: (sealPassword) => {
      updateState({ sealPassword });
    },
    setSealConfirm: (sealConfirm) => {
      updateState({ sealConfirm });
    },
    setSealDelete: (sealDelete) => {
      updateState({ sealDelete });
    },
    showSealUnlock: () => {
      updateState({ showSealUnlock: true });
    },
    hideSealUnlock: () => {
      updateState({ showSealUnlock: false });
    },
    showSealPassword: () => {
      updateState({ showSealPassword: true });
    },
    hideSealPassword: () => {
      updateState({ showSealPassword: false });
    },
    showSealConfirm: () => {
      updateState({ showSealConfirm: true });
    },
    hideSealConfirm: () => {
      updateState({ showSealConfirm: false });
    },
    updateSeal: () => {
      updateState({ sealMode: 'updating' });
    },
    setSealEnable: (sealEnabled) => {
      let sealMode = null;
      if (sealEnabled !== state.sealEnabled) {
        if (sealEnabled) {
          sealMode = 'enabling';
        }
        else {
          sealMode = 'disabling';
        }
      }
      else {
        if (state.sealEnabled && !state.sealUnlocked) {
          sealMode = 'unlocking';
        }
        else if (state.sealEnabled && state.sealUnlocked) {
          sealMode = 'unlocked';
        }
        else {
          sealMode = 'disabled';
        }
      }
      updateState({ sealEnabled, sealMode });
    },
    saveSeal: async () => {
      if (!state.saving) {
        try {
          updateState({ saving: true });

          if (state.sealMode === 'enabling') {
            await enable();
          }
          else if (state.sealMode === 'disabling') {
            await disable();
          }
          else if (state.sealMode === 'unlocking') {
            await unlock();
          }
          else if (state.sealMode === 'unlocked') {
            await forget();
          }
          else if (state.sealMode === 'updating') {
            await update();
          }
          else {
            console.log(state.sealMode);
          }

          updateState({ saving: false });
        }
        catch(err) {
          console.log(err);
          updateState({ saving: false });
          throw new Error('seal operation failed');
        }
      }
    },
    setVisible: async (searchable) => {
      updateState({ searchable });
      await account.actions.setSearchable(searchable);
    },
    setNotifications: async (pushEnabled) => {
      updateState({ pushEnabled });
      await account.actions.setNotifications(pushEnabled);
    },
    setEditPassword: (editPassword) => {
      updateState({ editPassword });
    },
    setEditConfirm: (editConfirm) => {
      updateState({ editConfirm });
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
            const available = await profile.actions.getHandleStatus(editHandle);
            updateState({ available, checked: true });
          }
        }
        catch (err) {
          console.log(err);
        }
      }, 1000);
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


