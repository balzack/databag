import { useState, useEffect, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';
import config from 'constants/Config';

export function useSession() {

  const [state, setState] = useState({
    tabbled: null,
  });
  const dimensions = useWindowDimensions();
  const app = useContext(AppContext);
  const navigate = useNavigate();

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

  const actions = {
  };

  return { state, actions };
}

