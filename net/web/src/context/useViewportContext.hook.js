import { useEffect, useState } from 'react';

export function useViewportContext() {

  const [state, setState] = useState({ });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  };

  const handleResize = () => {
    console.log(window.innerWidth);
    console.log(window.innerHeight);
    if (window.innerWidth < 600) {
      updateState({ display: 'small' });
    }
    else if (window.innerWidth < 1600) {
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

  return state
}


