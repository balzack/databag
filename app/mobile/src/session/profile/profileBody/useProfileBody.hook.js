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

  const actions = {
    sealTest: async () => {
      console.log("SEAL TEST");

      // generate key to encrypt private key
      const salt = CryptoJS.lib.WordArray.random(128 / 8);
      const aes = CryptoJS.PBKDF2('testpassword', salt, {
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

      const seal = {
        passwordSalt: salt.toString(),
        privateKeyIv: iv.toString(),
        privateKeyEncrypted: enc.ciphertext.toString(CryptoJS.enc.Base64),
        publicKey: convertPem(crypto.getPublicKey()),
      }
      console.log("SEAL:", seal);

    },
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
      updateState({ sealEdit: true, sealable, sealMode });
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

