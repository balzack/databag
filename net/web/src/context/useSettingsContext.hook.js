import { useEffect, useState } from 'react';
import { LightTheme, DarkTheme } from 'constants/Colors';

export function useSettingsContext() {

  const [state, setState] = useState({ 
    display: null,
    width: null,
    height: null,
    darkTheme: DarkTheme,
    lightTheme: LightTheme,
  });

  const SMALL_MEDIUM = 650;
  const MEDIUM_LARGE = 1000;
  const LARGE_XLARGE = 1600;

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  };

  const handleResize = () => {
    if (window.innerWidth < SMALL_MEDIUM) {
      updateState({ display: 'small', width: window.innerWidth, height: window.innerHeight });
    }
    else if (window.innerWidth < MEDIUM_LARGE) {
      updateState({ display: 'medium', width: window.innerWidth, height: window.innerHeight });
    }
    else if (window.innerWidth < LARGE_XLARGE) {
      updateState({ display: 'large', width: window.innerWidth, height: window.innerHeight });
    }
    else {
      updateState({ display: 'xlarge', width: window.innerWidth, height: window.innerHeight });
    }
  };

  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      setTimeout(handleResize, 100 * i); //cludge for my mobile browser
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const scheme = localStorage.getItem('color_scheme');
    if (scheme === 'dark') {
      updateState({ darkTheme: DarkTheme, lightTheme: DarkTheme });
    }
    else if (scheme === 'light') {
      updateState({ darkTheme: LightTheme, lightTheme: LightTheme });
    }
    else {
      updateState({ darkTheme: DarkTheme, lightTheme: LightTheme });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    }
    // eslint-disable-next-line
  }, []);

  const actions = {
    setDarkTheme() {
      localStorage.setItem('color_scheme', 'dark');
      updateState({ darkTheme: DarkTheme, lightTheme: DarkTheme });
    },
    setLightTheme() {
      localStorage.setItem('color_scheme', 'light');
      updateState({ darkTheme: LightTheme, lightTheme: LightTheme });
    },
    steDefaultTheme() {
      localStorage.clearItem('color_scheme');
      updateState({ darkTheme: DarkTheme, lightTheme: LightTheme });
    }
  }

  return { state, actions }
}


