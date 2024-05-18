import { useRef, useState, useEffect, useContext } from 'react';
import { AccountContext } from 'context/AccountContext';
import { ProfileContext } from 'context/ProfileContext';
import { SettingsContext } from 'context/SettingsContext';
import { generateSeal, unlockSeal, updateSeal } from 'context/sealUtil';
import { getUsername } from 'api/getUsername';
export function useAccountAccess() {
  
  const [state, setState] = useState({
    editLogin: false,
    editSeal: false,
    handle: null,
    editHandle: null,
    editStatus: null,
    editMessage: null,
    editPassword: null,
    EditConfirm: null,
    busy: false,
    searchable: null,
    checked: true,

    sealEnabled: false,
    sealMode: null,
    sealPassword: null,
    sealConfirm: null,
    sealDelete: null,
    sealUnlock: null,

    display: null,
    strings: {},
    menuStyle: {},
    timeFormat: '12h',
    dateFormat: 'mm/dd',
    theme: null,
    themes: [],
    language: null,
    languages: [],
    audioId: null,
    audioInputs: [],
    videoId: null,
    videoInputs: [],

    mfaModal: false,
    mfaEnabled: null,
    mfaSecret: null,
    mfaImage: null,
    mfaCode: null,
    mfaError: false,
    mfaErrorCode: null,

    seal: null,
    sealKey: null,
  });

  const profile = useContext(ProfileContext);
  const account = useContext(AccountContext);  
  const settings = useContext(SettingsContext);
  const debounce = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { handle } = profile.state.identity;
    updateState({ handle, editHandle: handle });
  }, [profile.state]);

  useEffect(() => {
    const { seal, sealKey, status } = account.state;
    updateState({ searchable: status?.searchable, mfaEnabled: status?.mfaEnabled, seal, sealKey });
  }, [account.state]);

  useEffect(() => {
    const { display, audioId, audioInputs, videoId, videoInputs, strings, menuStyle, timeFormat, dateFormat, theme, themes, language, languages } = settings.state;
    updateState({ display, audioId, audioInputs, videoId, videoInputs, strings, menuStyle, timeFormat, dateFormat, theme, themes, language, languages });
  }, [settings.state]);

  const sealUnlock = async () => {
    const unlocked = unlockSeal(state.seal, state.sealUnlock);
    await account.actions.unlockSeal(unlocked);
  };

  const sealForget = async () => {
    await account.actions.unlockSeal({});
  };

  const sealEnable = async () => {
    const generated = await generateSeal(state.sealPassword);
    await account.actions.setSeal(generated.seal, generated.sealKey);
  };

  const sealRemove = async () => {
    await account.actions.setSeal({}, {});
  };

  const sealUpdate = async () => {
    const updated = updateSeal(state.seal, state.sealKey, state.sealPassword);
    await account.actions.updateSeal(updated.seal);
  };

  const isEnabled = () => {
    if (state.seal?.publicKey) {
      return true;
    }
    return false;
  }

  const isUnlocked = () => {
    if (state.sealKey?.public && state.sealKey?.private && state.sealKey.public === state.seal.publicKey) {
      return true;
    }
    return false;
  }

  const actions = {
    setTimeFormat: (timeFormat) => {
      settings.actions.setTimeFormat(timeFormat.target.value);
    },
    setDateFormat: (dateFormat) => {
      settings.actions.setDateFormat(dateFormat.target.value);
    },
    setTheme: (theme) => {
      settings.actions.setTheme(theme);
    },
    setLanguage: (language) => {
      settings.actions.setLanguage(language);
    },
    setAudio: (device) => {
      settings.actions.setAudioInput(device);
    },
    setVideo: (device) => {
      settings.actions.setVideoInput(device);
    },
    setEditSeal: () => {
      let sealMode;
      let sealEnabled = isEnabled();
      if (sealEnabled) {
        if (isUnlocked()) {
          sealMode = 'enabled';
        }
        else {
          sealMode = 'unlocking';
        }
      }
      else {
        sealMode = 'disabled';
      }
      const editSeal = true;
      const sealPassword = null;
      const sealConfirm = null;
      const sealUnlock = null;
      const sealDelete = null;
      updateState({ editSeal, sealMode, sealEnabled, sealPassword, sealConfirm, sealUnlock, sealDelete });
    },
    clearEditSeal: () => {
      updateState({ editSeal: false });
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
    setSealUnlock: (sealUnlock) => {
      updateState({ sealUnlock });
    },
    updateSeal: () => {
      updateState({ sealMode: 'updating', sealConfirm: null, sealPassword: null });
    },
    enableSeal: (enable) => {
      let sealMode;
      if (enable && isEnabled()) {
        if (isUnlocked()) {
          sealMode = 'enabled';
        }
        else {
          sealMode = 'unlocking';
        }
      }
      if (enable && !isEnabled()) {
        sealMode = 'enabling';
      }
      if (!enable && isEnabled()) {
        sealMode = 'disabling';
      }
      if (!enable && !isEnabled()) {
        sealMode = 'disabled';
      }
      updateState({ sealEnabled: enable, sealMode });
    },
    canSaveSeal: () => {
      if (state.sealMode === 'disabling' && state.sealDelete === state.strings.delete) {
        return true;
      }
      if (state.sealMode === 'enabling' && state.sealPassword && state.sealPassword === state.sealConfirm) {
        return true;
      }
      if (state.sealMode === 'updating' && state.sealPassword && state.sealPassword === state.sealConfirm) {
        return true;
      }
      if (state.sealMode === 'unlocking' && state.sealUnlock) {
        return true;
      }
      return false;
    },
    saveSeal: async () => {
      if (state.busy) {
        throw new Error("operation in progress");
      }
      updateState({ busy: true });
      try {
        if (state.sealMode === 'enabling') {
          await sealEnable();
        }
        else if (state.sealMode === 'disabling') {
          await sealRemove();
        }
        else if (state.sealMode === 'updating') {
          await sealUpdate();
        }
        else if (state.sealMode === 'unlocking') {
          await sealUnlock();
        }
        else if (state.sealMode === 'enabled') {
          await sealForget();
        }
        updateState({ busy: false });
      }
      catch (err) {
        updateState({ busy: false });
        console.log(err);
        throw new Error("failed to save seal");
      }
    },
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
        else {
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
          updateState({ busy: false });
          throw new Error('failed to set searchable');
        }
      }
    },
    setCode: async (code) => {
      updateState({ mfaCode: code });
    },
    enableMFA: async () => {
      if (!state.busy) {
        try {
          updateState({ busy: true });
          const mfa = await account.actions.enableMFA();
          updateState({ busy: false, mfaModal: true, mfaError: false, mfaSecret: mfa.secretText, mfaImage: mfa.secretImage, mfaCode: '' });
        }
        catch (err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error('faild to enable mfa');
        }
      }   
    },
    disableMFA: async () => {
      if (!state.busy) {
        try {
          updateState({ busy: true });
          await account.actions.disableMFA();
          updateState({ busy: false });
        }
        catch (err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error('failed to disable mfa');
        }
      }
    },
    confirmMFA: async () => {
      if (!state.busy) {
        try {
          updateState({ busy: true });
          await account.actions.confirmMFA(state.mfaCode);
          updateState({ busy: false, mfaModal: false });
        }
        catch (err) {
          const msg = err?.message;
          updateState({ busy: false, mfaError: true, mfaErrorCode: msg });
          throw new Error('failed to confirm mfa');
        }
      }
    },
    dismissMFA: async () => {
      updateState({ mfaModal: false });
    },
  };

  return { state, actions };
}

