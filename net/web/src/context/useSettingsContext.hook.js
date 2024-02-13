import { useEffect, useState } from 'react';

const LightTheme = {
  background: '#8fbea7',
  primary: '#448866',
  formBackground: '#f2f2f2',
  darkBackground: '#222222',
  formFocus: '#f8f8f8',
  formHover: '#efefef',
  grey: '#888888',
  white: '#ffffff',
  black: '#000000',
  divider: '#dddddd',
  mask: '#dddddd',
  encircle: '#cccccc',
  alert: '#ff8888',
  warn: '#dd4444',
  enabled: '#444444',
  disabled: '#aaaaaa',
  text: '#444444',
  link: '#0077CC',
  itemDivider: '#eeeeee',
  connected: '#44cc44',
  connecting: '#dd88ff',
  requested: '#4488ff',
  pending: '#22aaaa',
  confirmed: '#aaaaaa',
  error: '#ff4444',
  profileForm: '#e8e8e8',
  profileDivider: '#aaaaaa',
  statsForm: '#ededed',
  statsDivider: '#afafaf',
  channel: '#f2f2f2',
  card: '#eeeeee',
  selectHover: '#fafafa',
};

const DarkTheme = {
  background: '#8fbea7',
  primary: '#448866',
  formBackground: '#f2f2f2',
  darkBackground: '#222222',
  formFocus: '#f8f8f8',
  formHover: '#efefef',
  grey: '#888888',
  white: '#ffffff',
  black: '#000000',
  divider: '#dddddd',
  mask: '#dddddd',
  encircle: '#cccccc',
  alert: '#ff8888',
  warn: '#dd4444',
  enabled: '#444444',
  disabled: '#aaaaaa',
  text: '#444444',
  link: '#0077CC',
  itemDivider: '#eeeeee',
  connected: '#44cc44',
  connecting: '#dd88ff',
  requested: '#4488ff',
  pending: '#22aaaa',
  confirmed: '#aaaaaa',
  error: '#ff4444',
  profileForm: '#e8e8e8',
  profileDivider: '#aaaaaa',
  statsForm: '#ededed',
  statsDivider: '#afafaf',
  channel: '#f2f2f2',
  card: '#eeeeee',
  selectHover: '#fafafa',
};


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


