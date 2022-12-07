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
    editSealEnabled: false,
    editSealMode: null,
    sealPassword: null,
    sealConfirm: null,
    unseal: null,
    unlock: null,
    seal: null,
    sealPrivate: null,
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
      const { seal, sealPrivate, status } = account.state;
      updateState({ searchable: status.searchabled, seal, sealPrivate });
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
    const aes = CryptoJS.PBKDF2(state.unlock, salt, {
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

    // store keuy
    await account.actions.unlockSeal(dec.toString(CryptoJS.enc.Utf8))
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
    const key = crypto.getKey();

    // encrypt private key
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const privateKey = convertPem(crypto.getPrivateKey());
    const enc = CryptoJS.AES.encrypt(privateKey, aes, { iv: iv });

    // update account
    const seal = {
      passwordSalt: salt.toString(),
      privateKeyIv: iv.toString(),
      privateKeyEncrypted: enc.ciphertext.toString(CryptoJS.enc.Base64),
      publicKey: convertPem(crypto.getPublicKey()),
    }
    await account.actions.setSeal(seal, privateKey);
  };

  const sealRemove = async () => {
    await account.actions.setSeal({});
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
    const enc = CryptoJS.AES.encrypt(state.privateKey, aes, { iv: iv });

    // update account
    const seal = {
      passwordSalt: salt.toString(),
      privateKeyIv: iv.toString(),
      privateKeyEncrypted: enc.ciphertext.toString(CryptoJS.enc.Base64),
      publicKey: state.seal.publicKey,
    }
    await account.actions.setSeal(seal, state.privateKey);
  };

  const actions = {
    setEditSeal: () => {
      updateState({ editSeal: true, editSealMode: null, unlock: null, editSealEnabled: state.seal });
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
    setUnseal: (unseal) => {
      updateState({ unseal });
    },
    setUnlock: (unlock) => {
      updateState({ unlock });
    },
    updateSeal: () => {
      updateState({ editSealMode: 'updating', sealConfirm: null, sealPassword: null });
    },
    enableSeal: (enable) => {
      if (enable && state.seal) {
        updateState({ editSealEnabled: true, editSealMode: null });
      }
      else if (enable) {
        updateState({ editSealEnabled: true, editSealMode: 'sealing', sealConfirm: null, sealPassword: null });
      }
      else if (!enable && state.seal) {
        updateState({ editSealEnabled: false, editSealMode: 'unsealing', unseal: null });
      }
      else {
        updateState({ editSealEnabled: false, editSealMode: null });
      }
    },
    canSaveSeal: () => {
      if (state.editSealMode === 'unsealing' && state.unseal === 'delete') {
        return true;
      }
      if (state.editSealMode === 'sealing' && state.sealPassword && state.sealPassword === state.sealConfirm) {
        return true;
      }
      if (state.editSealMode === 'updating' && state.sealPassword && state.sealPassword === state.sealConfirm) {
        return true;
      }
      if (state.editSealMode == null && state.seal && !state.sealPrivate) {
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
        if (state.editSealMode === 'sealing') {
          await sealEnable();
        }
        else if (state.editSealMode === 'unsealing') {
          await sealRemove();
        }
        else if (state.editSealMode === 'updating') {
          await sealUpdate();
        } 
        else {
          await sealUnlock();
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

