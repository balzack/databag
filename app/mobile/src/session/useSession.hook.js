import { useState, useEffect, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';
import config from 'constants/Config';

export function useSession() {

  const [state, setState] = useState({
    tabbled: null,
    profileWidth: '33%',
    cardWidth: '33%',
    cardId: null,
    converstaionId: null,
    contactDrawer: 'profile',
  });
  const dimensions = useWindowDimensions();
  const app = useContext(AppContext);
  const navigate = useNavigate();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    if (dimensions.width > config.tabbedWidth) {
      const width = Math.floor((dimensions.width * 33) / 100);
      if (width > 500) {
        updateStatus({ tabbed: false, cardWidth: 550, profileWidth: 500 });
      }
      else {
        updateState({ tabbed: false, cardWidth: width + 50, profileWidth: width });
      }
    }
    else {
      updateState({ tabbed: true });
    }
  }, [dimensions]);

  const actions = {
    setContactDrawer: (contactDrawer) => {
      updateState({ contactDrawer });
    },
  };

  return { state, actions };
}

