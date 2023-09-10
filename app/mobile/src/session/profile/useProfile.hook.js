import { useState, useEffect, useRef, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { getLanguageStrings } from 'constants/Strings';
import { ProfileContext } from 'context/ProfileContext';
import { AccountContext } from 'context/AccountContext';
import avatar from 'images/avatar.png';

export function useProfile() {

  const [state, setState] = useState({
    strings: getLanguageStrings(),
    searchable: null,
    imageSource: null,
    name: null,
    username: null,
    location: null,
    description: null,
  });

  const dimensions = useWindowDimensions();
  const profile = useContext(ProfileContext);
  const account = useContext(AccountContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { width, height } = dimensions;
    if (height > width) {
      updateState({ width, height: width });
    }
    else {
      updateState({ width: height, height });
    }
  }, [dimensions]);

  useEffect(() => {
    const { searchable } = account.state.status;
    updateState({ searchable });
  }, [account.state]);

  useEffect(() => {
    const { name, handle, node, location, description, image } = profile.state.identity;
    const imageSource = image ? { uri: profile.state.imageUrl } : avatar;
    const username = `${handle} / ${node}`
    updateState({ name, username, location, description, imageSource });
  }, [profile.state]);

  const actions = {
    setVisible: async (searchable) => {
      await account.actions.setSearchable(searchable);
      updateState({ searchable });
    },
  };

  return { state, actions };
}


