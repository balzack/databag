import { useRef, useState, useEffect, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import config from 'constants/Config';
import { StoreContext } from 'context/StoreContext';

export function useSession() {

  const [state, setState] = useState({
    tabbled: null,
    subWidth: '33%',
    baseWidth: '33%',
    cardId: null,
    converstaionId: null,
    firstRun: null,
  });

  const store = useContext(StoreContext);
  const dimensions = useWindowDimensions();
  const navigate = useNavigate();
  const tabbed = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    checkFirstRun();
  }, []);

  const checkFirstRun = async () => {
    const firstRun = await store.actions.getFirstRun();
    updateState({ firstRun });
  }

  useEffect(() => {
    if (tabbed.current !== true) {
      if (dimensions.width > config.tabbedWidth) {
        const width = Math.floor((dimensions.width * 33) / 100);
        tabbed.current = false;
        if (width > 500) {
          updateStatus({ tabbed: false, baseWidth: 550, subWidth: 500 });
        }
        else {
          updateState({ tabbed: false, baseWidth: width + 50, subWidth: width });
        }
      }
      else {
        tabbed.current = true;
        updateState({ tabbed: true });
      }
    }
  }, [dimensions]);

  const actions = {
    setCardId: (cardId) => {
      updateState({ cardId });
    },
    clearFirstRun: () => {
      updateState({ firstRun: false });
      store.actions.setFirstRun();
    },
  };

  return { state, actions };
}

