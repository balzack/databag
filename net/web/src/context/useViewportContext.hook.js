import { useEffect, useState } from 'react';

export function useViewportContext() {

  const [state, setState] = useState({ });
  const SMALL_MEDIUM = 600;
  const MEDIUM_LARGE = 1600

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
    else {
      updateState({ display: 'large' });
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []);

  return { state, actions: {} }
}


