import { useRef, useState, useEffect, useContext } from 'react';
import { AccountContext } from 'context/AccountContext';
import { ProfileContext } from 'context/ProfileContext';
import { getUsername } from 'api/getUsername';
import CryptoJS from 'crypto-js';
import { JSEncrypt } from 'jsencrypt'

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

    seal: null,
    sealKey: null,
  });

  const profile = useContext(ProfileContext);
  const account = useContext(AccountContext);  
  const debounce = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (profile.state.identity?.guid) {
      const { handle } = profile.state.identity;
      updateState({ handle, editHandle: handle });
    }
  }, [profile]);

  useEffect(() => {
    if (account?.state?.status) {
      const { seal, sealKey, status } = account.state;
      updateState({ searchable: status.searchable, seal, sealKey });
    }
  }, [account]);

  const convertPem = (pem) => {
    var lines = pem.split('\n');
    var encoded = '';
    for(var i = 0;i < lines.length;i++){
      if (lines[i].trim().length > 0 &&
          lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 && 
          lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
          lines[i].indexOf('-BEGIN PUBLIC KEY-') < 0 &&
          lines[i].indexOf('-END PUBLIC KEY-') < 0 &&
          lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
          lines[i].indexOf('-END RSA PUBLIC KEY-') < 0) {
        encoded += lines[i].trim();
      }
    }
    return encoded
  };
 
  const sealUnlock = async () => {

    // generate key to encrypt private key
    const salt = CryptoJS.enc.Hex.parse(state.seal.passwordSalt);
    const aes = CryptoJS.PBKDF2(state.sealUnlock, salt, {
      keySize: 256 / 32,
      iterations: 1024,
    });

    // decrypt private key
    const iv = CryptoJS.enc.Hex.parse(state.seal.privateKeyIv);
    const enc = CryptoJS.enc.Base64.parse(state.seal.privateKeyEncrypted)

    let cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: enc,
      iv: iv
    });
    const dec = CryptoJS.AES.decrypt(cipherParams, aes, { iv: iv });
    const privateKey = dec.toString(CryptoJS.enc.Utf8)

    // store ke
    const sealKey = {
      public: state.seal.publicKey,
      private: privateKey,
    }

    await account.actions.unlockSeal(sealKey);
  };

  const sealForget = async () => {
    await account.actions.unlockSeal({});
  };

  const sealEnable = async () => {

    // generate key to encrypt private key
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const aes = CryptoJS.PBKDF2(state.sealPassword, salt, {
      keySize: 256 / 32,
      iterations: 1024,
    });

    // generate rsa key for sealing channel, delay for activity indicator
    await new Promise(r => setTimeout(r, 1000));
    const crypto = new JSEncrypt({ default_key_size: 2048 });
    crypto.getKey();

    // encrypt private key
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const privateKey = convertPem(crypto.getPrivateKey());
    const enc = CryptoJS.AES.encrypt(privateKey, aes, { iv: iv });
    const publicKey = convertPem(crypto.getPublicKey());

    // update account
    const seal = {
      passwordSalt: salt.toString(),
      privateKeyIv: iv.toString(),
      privateKeyEncrypted: enc.ciphertext.toString(CryptoJS.enc.Base64),
      publicKey: publicKey, 
    }
    const sealKey = {
      public: publicKey,
      private: privateKey,
    }
    await account.actions.setSeal(seal, sealKey);
  };

  const sealRemove = async () => {
    await account.actions.setSeal({}, {});
  };

  const sealUpdate = async () => {

    // generate key to encrypt private key
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const aes = CryptoJS.PBKDF2(state.sealPassword, salt, {
      keySize: 256 / 32,
      iterations: 1024,
    });

    // encrypt private key
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const enc = CryptoJS.AES.encrypt(state.sealKey.private, aes, { iv: iv });

    // update account
    const seal = {
      passwordSalt: salt.toString(),
      privateKeyIv: iv.toString(),
      privateKeyEncrypted: enc.ciphertext.toString(CryptoJS.enc.Base64),
      publicKey: state.seal.publicKey,
    }
    await account.actions.updateSeal(seal);
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
      if (state.sealMode === 'disabling' && state.sealDelete === 'delete') {
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
          updateState({ busy: false });
          throw new Error('failed to set searchable');
        }
      }
    },
  };

  return { state, actions };
}

