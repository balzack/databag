import { useState, useEffect, useRef, useContext } from 'react';
import { getLanguageStrings } from 'constants/Strings';
import { ProfileContext } from 'context/ProfileContext';
import { AccountContext } from 'context/AccountContext';
import { generateSeal, updateSeal, unlockSeal } from 'context/sealUtil';

export function useSettings() {

  const profile = useContext(ProfileContext);
  const account = useContext(AccountContext);

  const [state, setState] = useState({
    strings: getLanguageStrings(),
    timeFull: false,
    monthLast: false,

    editSeal: false,
    sealMode: null,
    sealUnlock: null,
    sealPassword: null,
    sealConfirm: null,
    sealDelete: null,
    seal: null,
    sealKey: null,
    sealEnabled: false,
    sealUnlocked: false,
    sealable: false,
    canSaveSeal: false,
    showSealUnlock: false,
    showSealConfirm: false,
    showSealPassword: false,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { timeFull, monthLast } = profile.state;
    updateState({ timeFull, monthLast });
  }, [profile.state.timeFull, profile.state.monthLast]);

  useEffect(() => {
    const { seal, sealable } = account.state.status;
    const sealKey = account.state.sealKey;
    const sealEnabled = seal?.publicKey != null;
    const sealUnlocked = seal?.publicKey === sealKey?.public && sealKey?.private && sealKey?.public;
    updateState({ sealable, seal, sealKey, sealEnabled, sealUnlocked });
  }, [account.state]);

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

  const actions = {
    setTimeFull: async (flag) => {
      updateState({ timeFull: flag });
      await profile.actions.setTimeFull(flag);
    },
    setMonthLast: async (flag) => {
      updateState({ monthLast: flag });
      await profile.actions.setMonthLast(flag);
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
  };

  return { state, actions };
}


