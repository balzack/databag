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
    imageWidth: null,
    imageHeight: null,
    detailWidth: null,
    details: false,
    detailName: '',
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
      updateState({ imageWidth: width, imageHeight: width, detailWidth: width + 2 });
    }
    else {
      updateState({ imageWidth: height, imageHeight, detailWidth: width + 2 });
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
      const cur = state.searchable;
      try {
        updateState({ searchable });
        await account.actions.setSearchable(searchable);
      }
      catch(err) {
        updateState({ searchable: cur });
        throw err;
      }
    },
    setProfileImage: async (data) => {
      await profile.actions.setProfileImage(data);
    },
    showDetails: () => {
      updateState({ details: true, detailName: '', detailLocation: '', detailDescription: '' });
    },
    hideDetails: () => {
      updateState({ details: false });
    },
    setDetailName: (detailName) => {
      updateState({ detailName });
    },
    setDetailLocation: (detailLocation) => {
      updateState({ detailLocation });
    },
    setDetailDescription: (detailDescription) => {
      updateState({ detailDescription });
    },
  };

  return { state, actions };
}


