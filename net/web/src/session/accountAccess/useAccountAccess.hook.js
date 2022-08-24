import { useRef, useState, useEffect, useContext } from 'react';
import { AccountContext } from 'context/AccountContext';
import { ProfileContext } from 'context/ProfileContext';
import { getUsername } from 'api/getUsername';

export function useAccountAccess() {
  
  const [state, setState] = useState({
    editLogin: false,
    handle: null,
    editHandle: null,
    editStatus: null,
    editMessage: null,
    editPassword: null,
    editConfirm: null,
    busy: false,
    searchable: null,
    checked: true,
  });

  const profile = useContext(ProfileContext);
  const account = useContext(AccountContext);  
  const debounce = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (profile.state.init) {
      const { handle } = profile.state.profile;
      updateState({ handle, editHandle: handle });
    }
  }, [profile]);

  useEffect(() => {
    if (account?.state?.status) {
      updateState({ searchable: account.state.status.searchable });
    }
  }, [account]);

  const actions = {
    setEditLogin: () => {
      updateState({ editLogin: true });
    },
    clearEditLogin: () => {
      updateState({ editLogin: false });
    },
    setEditHandle: (editHandle) => {
      updateState({ checked: false, editHandle });
      clearTimeout(debounce.current);
      debounce.current = setTimeout(async () => {
        if (editHandle.toLowerCase() === state.handle.toLowerCase()) {
          updateState({ checked: true, editStatus: 'success', editMessage: '' });
        }
        try {
          let valid = await getUsername(editHandle);
          if (valid) {
            updateState({ checked: true, editStatus: 'success', editMessage: '' });
          }
          else {
            updateState({ checked: true, editStatus: 'error', editMessage: 'Username is not available' });
          }
        }
        catch(err) {
          console.log(err);
          updateState({ checked: true, editStatus: 'success', editMessage: '' });
        }
      }, 500);
    },
    setEditPassword: (editPassword) => {
      updateState({ editPassword });
    },
    setEditConfirm: (editConfirm) => {
      updateState({ editConfirm });
    },
    canSaveLogin: () => {
      if(state.editStatus === 'error' || !state.checked) {
        return false;
      }
      if(state.editHandle && state.editPassword && state.editPassword === state.editConfirm) {
        return true;
      }
      return false;
    },
    setLogin: async () => {
      if (!state.editHandle || !state.editPassword || state.editPassword !== state.editConfirm) {
        throw new Error("Invalid login credentials");
      }
      if (!state.busy) {
        try {
          updateState({ busy: true });
          await account.actions.setLogin(state.editHandle, state.editPassword);
          updateState({ busy: false });
        }
        catch(err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error("failed to update login");
        }
      }
      else {
        throw new Error("save in progress");
      }
    },
    setSearchable: async (flag) => {
      if (!state.busy) {
        try {
          updateState({ busy: true });
          await account.actions.setSearchable(flag);
          updateState({ busy: false });
        }
        catch (err) {
          console.log(err);
          throw new Error('failed to set searchable');
          updateState({ busy: false });
        }
      }
    },
  };

  return { state, actions };
}

