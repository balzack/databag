import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWindowDimensions } from 'react-native';
import { ProfileContext } from 'context/ProfileContext';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';
import config from 'constants/Config';
import { JSEncrypt } from 'jsencrypt'
import CryptoJS from "crypto-js";

export function useProfileBody() {

  const [state, setState] = useState({
    name: null,
    handle: null,
    location: null,
    description: null,
    node: null,
    imageSource: null,
    searchable: null,
    notifications: null,
    showDetailEdit: false,
    showLoginEdit: false,
    editName: null,
    editLocation: null,
    editDescription: null,
    editHandle: null,
    editPassword: null,
    editConfirm: null,
    checked: true,
    available: true,
    showPassword: false,
    showConfirm: false,
    blockedChannels: false,
    blockedCards: false,
    blockedMessages: false,
    tabbed: null,
    disconnected: false,

    seal: null,
    sealKey: null,
    sealEnabled: false,
    sealUnlocked: false,
    canSaveSeal: false, 
    
    sealEdit: false,
    sealMode: null,
    sealable: false,
    sealUnlock: null,
    showSealUnlock: false,
    sealPassword: null,
    showSealPassword: false,
    sealConfirm: null,
    showSealConfirm: false,
    sealDelete: null,
  });

  const app = useContext(AppContext);
  const dimensions = useWindowDimensions();
  const account = useContext(AccountContext);
  const profile = useContext(ProfileContext);
  const navigate = useNavigate();
  const debounce = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (dimensions.width > config.tabbedWidth) {
      updateState({ tabbed: false });
    }
    else {
      updateState({ tabbed: true });
    }
  }, [dimensions]);

  useEffect(() => {
    const { name, handle, node, location, description, image } = profile.state.profile;
    const imageSource = image ? profile.state.imageUrl : 'avatar';
    updateState({ name, handle, node, location, description, imageSource, editHandle: handle,
        editName: name, editLocation: location, editDescription: description });
  }, [profile]);

  useEffect(() => {
    const { searchable, pushEnabled, seal } = account.state.status;
    const sealKey = account.state.sealKey;
    const sealEnabled = seal?.publicKey != null;
    const sealUnlocked = seal?.publicKey === sealKey?.public && sealKey?.private && sealKey?.public;
    updateState({ searchable, pushEnabled, seal, sealKey, sealEnabled, sealUnlocked });
  }, [account]);

  useEffect(() => {
    const { disconnected } = app.state;
    updateState({ disconnected });
  }, [app]);

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
    const publicKey = convertPem(crypto.getPublicKey());
    const enc = CryptoJS.AES.encrypt(privateKey, aes, { iv: iv });

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
    await account.actions.setAccountSeal(seal, sealKey); 
  };

  const sealDisable = async () => {
    await account.actions.setAccountSeal({}, {});
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

    // store unlocked seal
    const sealKey = {
      public: state.seal.publicKey,
      private: dec.toString(CryptoJS.enc.Utf8),
    };
    await account.actions.unlockAccountSeal(sealKey);
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
      publicKey: state.sealKey.public,
    }
    const sealKey = { ...state.sealKey }
    await account.actions.setAccountSeal(seal, sealKey); 
  };

  useEffect(() => {
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
    showSealEdit: () => {
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
      updateState({ sealEdit: true, sealable, sealMode, sealUnlock: null, sealPassword: null, sealConfirm: null, sealDelete: null });
    },
    hideSealEdit: () => {
      updateState({ sealEdit: false });
    },
    setSealable: (sealable) => {
      let sealMode = null;
      if (sealable !== state.sealEnabled) {
        if (sealable) {
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
      updateState({ sealable, sealMode });
    },
    saveSeal: async () => {
      if (state.sealMode === 'enabling') {
        await sealEnable();
      }
      else if (state.sealMode === 'disabling') {
        await sealDisable();
      }
      else if (state.sealMode === 'unlocking') {
        await sealUnlock();
      }
      else if (state.sealMode === 'updating') {
        await sealUpdate();
      }
      else {
        console.log(state.sealMode);
      }
    },
    showSealUnlock: () => {
      updateState({ showSealUnlock: true });
    },
    hideSealUnlock: () => {
      updateState({ showSealUnlock: false });
    },
    setSealUnlock: (sealUnlock) => {
      updateState({ sealUnlock });
    },
    showSealPassword: () => {
      updateState({ showSealPassword: true });
    },
    hideSealPassword: () => {
      updateState({ showSealPassword: false });
    },
    setSealPassword: (sealPassword) => {
      updateState({ sealPassword });
    },
    showSealConfirm: () => {
      updateState({ showSealConfirm: true });
    },
    hideSealConfirm: () => {
      updateState({ showSealConfirm: false });
    },
    setSealConfirm: (sealConfirm) => {
      updateState({ sealConfirm });
    },
    setSealDelete: (sealDelete) => {
      updateState({ sealDelete });
    },
    updateSeal: () => {
      updateState({ sealMode: 'updating' });
    },
    logout: () => {
      app.actions.logout();
      navigate('/');
    },
    remove: async () => {
      await app.actions.remove();
      updateState({ showDelete: false });
      navigate('/');
    },
    setVisible: async (searchable) => {
      updateState({ searchable });
      await account.actions.setSearchable(searchable);
    },
    setNotifications: async (pushEnabled) => {
      updateState({ pushEnabled });
      await account.actions.setNotifications(pushEnabled);
    },
    setProfileImage: async (data) => {
      await profile.actions.setProfileImage(data);
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
            const available = await profile.actions.getHandle(editHandle);
            updateState({ available, checked: true });
          }
        }
        catch (err) {
          console.log(err);
        }
      }, 1000);
    },
    setEditPassword: (editPassword) => {
      updateState({ editPassword });
    },
    setEditConfirm: (editConfirm) => {
      updateState({ editConfirm });
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

