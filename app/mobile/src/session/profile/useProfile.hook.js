import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from 'context/ProfileContext';
import { AccountContext } from 'context/AccountContext';
import { AppContext } from 'context/AppContext';

export function useProfile() {

  const [state, setState] = useState({
    name: null,
    handle: null,
    location: null,
    description: null,
    node: null,
    imageSource: null,
    searchable: null,
  });

  const app = useContext(AppContext);
  const account = useContext(AccountContext);
  const profile = useContext(ProfileContext);
  const navigate = useNavigate();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { name, handle, node, location, description, image } = profile.state.profile;
    const imageSource = image ? profile.state.imageUrl : 'avatar';
    updateState({ name, handle, node, location, description, imageSource });
  }, [profile]);

  useEffect(() => {
    updateState({ searchable: account.state.status.searchable });
  }, [account]);

  const actions = {
    logout: () => {
      app.actions.logout();
      navigate('/');
    },
    setVisible: async (visible) => {
      await account.actions.setSearchable(visible);
    },
  };

  return { state, actions };
}

