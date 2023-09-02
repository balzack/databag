import { useState, useEffect, useRef, useContext } from 'react';
import { getLanguageStrings } from 'constants/Strings';
import { ProfileContext } from 'context/ProfileContext';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';
import { generateSeal, updateSeal, unlockSeal } from 'context/sealUtil';

export function useSettings() {

  const profile = useContext(ProfileContext);
  const account = useContext(AccountContext);
  const app = useContext(AppContext);

  const debounce = useRef(null);
  const checking = useRef(null);

  const [state, setState] = useState({
    strings: getLanguageStrings(),
    timeFull: false,
    monthLast: false,
    pushEnabled: null,

    login: false,
    username: null,
    validated: false,
    available: true,
    password: null,
    confirm: null,
    delete: null,
    
    logout: false,
    editSeal: false,
    sealEnabled: false,
    sealUnlocked: false,
    sealPassword: null,
    sealConfirm: null,
    sealDelete: null,
    hideConfirm: true,
    hidePassword: true,
    sealRemove: false,
    sealUpdate: false,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { timeFull, monthLast } = profile.state;
    const handle = profile.state.identity.handle;
    updateState({ timeFull, monthLast, handle });
  }, [profile.state]);

  useEffect(() => {
    const { seal, sealable, pushEnabled } = account.state.status;
    const sealKey = account.state.sealKey;
    const sealEnabled = seal?.publicKey != null;
    const sealUnlocked = seal?.publicKey === sealKey?.public && sealKey?.private && sealKey?.public;
    updateState({ sealable, seal, sealKey, sealEnabled, sealUnlocked, pushEnabled });
  }, [account.state]);

  const unlockKey = async () => {
    const sealKey = unlockSeal(state.seal, state.sealPassword);
    await account.actions.unlockAccountSeal(sealKey);
  };

  const disableKey = async () => {
    await account.actions.unlockAccountSeal({});
  }

  const updateKey = async () => {
    const updated = updateSeal(state.seal, state.sealKey, state.sealPassword);
    await account.actions.setAccountSeal(updated.seal, updated.sealKey);
  }

  const generateKey = async () => {
    const created = await generateSeal(state.sealPassword);
    await account.actions.setAccountSeal(created.seal, created.sealKey);
  }

  const removeKey = async () => {
    await account.actions.setAccountSeal({}, {});
  }

  const actions = {
    setTimeFull: async (flag) => {
      updateState({ timeFull: flag });
      await profile.actions.setTimeFull(flag);
    },
    setMonthLast: async (flag) => {
      updateState({ monthLast: flag });
      await profile.actions.setMonthLast(flag);
    },
    setNotifications: async (flag) => {
      await account.actions.setNotifications(flag);
    },
    showLogin: () => {
      updateState({ login: true, username: state.handle, password: '', confirm: '', validated: true });
    },
    hideLogin: () => {
      updateState({ login: false });
    },
    changeLogin: async () => {
      await account.actions.setLogin(state.username, state.password);
    },
    deleteAccount: async () => {
      await app.actions.remove();
    },
    setUsername: (username) => {
      clearTimeout(debounce.current);
      checking.current = username;
      updateState({ username, validated: false });
      if (!username) {
        updateState({ available: false, validated: false });
      }
      else if (state.handle === username) {
        updateState({ available: true, validated: true });
      }
      else {
        debounce.current = setTimeout(async () => {
          const cur = JSON.parse(JSON.stringify(username));
          const available = await profile.actions.getHandleStatus(cur);
console.log("CHECKED:", available);

          if (checking.current === cur) {
            updateState({ available, validated: true });
          }
        }, 1000);
      }
    },
    setPassword: (password) => {
      updateState({ password });
    },
    setConfirm: (confirm) => {
      updateState({ confirm });
    },
    logout: async () => {
      await app.actions.logout();
    },
    showDelete: () => {
      updateState({ delete: true, confirm: null });
    },
    hideDelete: () => {
      updateState({ delete: false });
    },
    showLogout: () => {
      updateState({ logout: true });
    },
    hideLogout: () => {
      updateState({ logout: false });
    },
    showEditSeal: () => {
      updateState({ editSeal: true, sealPassword: null, sealConfirm: null, hidePassword: true, hideConfirm: true,
          sealDelete: null, sealRemove: false, sealUpdate: false });
    },
    hideEditSeal: () => {
      updateState({ editSeal: false });
    },
    showSealRemove: () => {
      updateState({ sealRemove: true });
    },
    hideSealRemove: () => {
      updateState({ sealRemove: false });
    },
    showSealUpdate: () => {
      updateState({ sealUpdate: true });
    },
    hideSealUpdate: () => {
      updateState({ sealUpdate: false });
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
    showPassword: () => {
      updateState({ hidePassword: false });
    },
    hidePassword: () => {
      updateState({ hidePassword: true });
    },
    showConfirm: () => {
      updateState({ hideConfirm: false });
    },
    hideConfirm: () => {
      updateState({ hideConfirm: true });
    },
    generateKey: async () => {
      await generateKey();
    },
    disableKey: async () => {
      await disableKey();
    },
    unlockKey: async () => {
      await unlockKey();
    },
    updateKey: async () => {
      await updateKey();
    },
    removeKey: async () => {
      await removeKey();
    },
  };

  return { state, actions };
}


