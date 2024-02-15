import { useEffect, useState } from 'react';
import { LightTheme, DarkTheme } from 'constants/Colors';
import { en, fr } from 'constants/Strings';

export function useSettingsContext() {

  const [state, setState] = useState({ 
    display: null,
    width: null,
    height: null,
    theme: null,
    colors: {},
    menuStyle: {},
    language: 'en',
    strings: en,
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
      updateState({ theme: scheme, colors: DarkTheme, menuStyle: { backgroundColor: DarkTheme.headerArea, color: DarkTheme.mainText } });
    }
    else if (scheme === 'light') {
      updateState({ theme: scheme, colors: LightTheme, menuStyle: { backgroundColor: LightTheme.headerArea, color: LightTheme.mainText } })
    }
    else {
      if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        updateState({ theme: null, colors: DarkTheme, menuStyle: { backgroundColor: DarkTheme.headerArea, color: DarkTheme.mainText } });
      }
      else {
        updateState({ theme: null, colors: LightTheme, menuStyle: { backgroundColor: LightTheme.headerArea, color: LightTheme.mainText } });
      }
    }

    const language = localStorage.getItem('language');
    if (language && language.startsWith('fr')) {
      updateState({ language: 'fr', strings: fr });
    }
    else {
      updateState({ language: 'en', strings: en });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    }
    // eslint-disable-next-line
  }, []);

  const actions = {
    setDarkTheme: () => {
      localStorage.setItem('color_scheme', 'dark');
      updateState({ theme: 'dark', colors: DarkTheme, menuStyle: { backgroundColor: DarkTheme.headerArea, color: DarkTheme.mainText } });
    },
    setLightTheme : () => {
      localStorage.setItem('color_scheme', 'light');
      updateState({ theme: 'light', colors: LightTheme, menuStyle: { backgroundColor: LightTheme.headerArea, color: LightTheme.mainText } });
    },
    setDefaultTheme: () => {
      localStorage.clearItem('color_scheme');
      if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        updateState({ theme: null, colors: DarkTheme, menuStyle: { backgroundColor: DarkTheme.headerArea, color: DarkTheme.mainText } });
      }
      else {
        updateState({ theme: null, colors: LightTheme, menuStyle: { backgroundColor: LightTheme.headerArea, color: LightTheme.mainText } });
      }
    },
    setLanguage: (code: string) => {
      localStorage.setItem('language', code);
      if (code && code.startsWith('fr')) {
        updateState({ language: 'fr', strings: fr });
      }
      else {
        updateState({ language: 'en', strings: en });
      }
    },
  }

  return { state, actions }
}


