import { useEffect, useState } from 'react';

export function useViewportContext() {

  const [state, setState] = useState({ });
  const SMALL_MEDIUM = 650;
  const MEDIUM_LARGE = 1000;
  const LARGE_XLARGE = 1400;

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  };

  const handleResize = () => {
    if (window.innerWidth < SMALL_MEDIUM) {
      updateState({ display: 'small' });
    }
    else if (window.innerWidth < MEDIUM_LARGE) {
      updateState({ display: 'medium' });
    }
    else if (window.innerWidth < LARGE_XLARGE) {
      updateState({ display: 'large' });
    }
    else {
      updateState({ display: 'xlarge' });
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []);

  return { state, actions: {} }
}


