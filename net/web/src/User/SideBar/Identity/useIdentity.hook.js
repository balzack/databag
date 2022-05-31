import { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from 'context/AppContext';
import { ProfileContext } from 'context/ProfileContext';
import { AccountContext } from 'context/AccountContext';
import { useNavigate } from "react-router-dom";
import { getUsername } from 'api/getUsername';

export function useIdentity() {
  
  const [state, setState] = useState({
    name: '',
    handle: '',
    domain: '',
    imageUrl: null,
    image: null,

    username: null,
    usernameStatus: null,
    password: null,
    passwordStatus: null,
    confirm: null,
    confirmStatus: null,
    
  });

  const navigate = useNavigate();
  const profile = useContext(ProfileContext);
  const account = useContext(AccountContext);
  const app = useContext(AppContext);
  const debounce = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    logout: async () => {
      app.actions.logout();
      navigate('/');
    },
    editLabels: () => {
      console.log("EDIT LABELS");
    },
    editProfile: () => {
      navigate('/user/profile');
    },
    setUsername: (value) => {
      if (debounce.current) {
        clearTimeout(debounce.current);
      }
      updateState({ username: value });
      if (state.handle.toLowerCase() == value.toLowerCase() || value == null || value == '') {
        updateState({ usernameStatus: null });
        return;
      }
      debounce.current = setTimeout(async () => {
        let available = await getUsername(value);
        if (available) {
          updateState({ usernameStatus: null });
        }
        else {
          updateState({ usernameStatus: 'not available' });
        }
      }, 500);
    },
    setPassword: (value) => {
      updateState({ password: value });
    },
    setConfirm: (value) => {
      updateState({ confirm: value });
    },
    setLogin: async () => {
      if (state.username == null || state.username == '') {
        updateState({ usernameStatus: 'username required' });
        throw 'username required';
      }
      else {
        updateState({ usernameStatus: null });
      }
      if (state.password == null || state.password == '') {
        updateState({ passwordStatus: 'password required' });
        throw 'password required';
      }
      else {
        updateState({ passwordStatus: null });
      }
      if (state.confirm != state.password) {
        updateState({ confirmStatus: 'password mismatch' });
        throw 'password mismatch';
      }
      else {
        updateState({ confirmStatus: null });
      }
      await account.actions.setLogin(state.username, state.password);
    },
  };

  useEffect(() => {
    if (app.state && app.state.access != 'user') {
      navigate('/');
    }
  }, [app]);

  useEffect(() => {
    if (profile?.state?.profile) {
      let identity = profile.state.profile;
      updateState({ imageUrl: profile.actions.profileImageUrl() })
      updateState({ image: identity.image });
      updateState({ name: identity.name });
      updateState({ handle: identity.handle });
      updateState({ username: identity.handle });
      updateState({ domain: identity.node });
    }
  }, [profile])

  return { state, actions };
}
