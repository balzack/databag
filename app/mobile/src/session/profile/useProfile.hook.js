import { useState, useEffect, useRef, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from 'context/ProfileContext';
import avatar from 'images/avatar.png';

export function useProfile() {

  const [state, setState] = useState({
    imageSource: null,
  });

  const dimensions = useWindowDimensions();
  const profile = useContext(ProfileContext);

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
    const { name, handle, node, location, description, image } = profile.state.identity;
    const imageSource = image ? { uri: profile.state.imageUrl } : avatar;
    updateState({ name, handle, node, location, description, imageSource });
  }, [profile.state]);

  const actions = {
  };

  return { state, actions };
}


