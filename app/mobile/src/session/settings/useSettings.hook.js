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
    sealEnabled: false,
    sealUnlocked: false,
    sealPassword: null,
    sealConfirm: null,
    hideConfirm: true,
    hidePassword: true,
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
    updateState({ sealable, seal, sealKey, sealEnabled: false, sealUnlocked });
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
      updateState({ editSeal: true, sealPassword: null, sealConfirm: null });
    },
    hideEditSeal: () => {
      updateState({ editSeal: false });
    },
    setSealPassword: (sealPassword) => {
      updateState({ sealPassword });
    },
    setSealConfirm: (sealConfirm) => {
      updateState({ sealConfirm });
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
    generateKey: () => {
      console.log("GENERATE KEY");
    },
  };

  return { state, actions };
}


