import React, { useEffect, useRef } from 'react';
import {Text, StatusBar} from 'react-native';
import {AppContextProvider} from './src/context/AppContext';
import {DisplayContextProvider} from './src/context/DisplayContext';
import {NativeRouter} from 'react-router-native';
import {Routes, Route} from 'react-router-dom';
import {Root} from './src/root/Root';
import {Access} from './src/access/Access';
import {Service} from './src/service/Service';
import {Session} from './src/session/Session';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';

import {useColorScheme} from 'react-native';
import {MD3LightTheme, MD3DarkTheme, PaperProvider} from 'react-native-paper';

const databagColors = {
  light: {
    primary: 'rgb(0, 108, 71)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(142, 247, 193)',
    onPrimaryContainer: 'rgb(0, 33, 19)',
    secondary: 'rgb(121, 89, 0)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(255, 223, 160)',
    onSecondaryContainer: 'rgb(38, 26, 0)',
    tertiary: 'rgb(60, 100, 114)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(192, 233, 250)',
    onTertiaryContainer: 'rgb(0, 31, 40)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(251, 253, 248)',
    onBackground: 'rgb(25, 28, 26)',
    surface: 'rgb(251, 253, 248)',
    onSurface: 'rgb(25, 28, 26)',
    surfaceVariant: 'rgb(220, 229, 220)',
    onSurfaceVariant: 'rgb(64, 73, 67)',
    outline: 'rgb(112, 121, 114)',
    outlineVariant: 'rgb(128, 128, 128)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(46, 49, 46)',
    inverseOnSurface: 'rgb(239, 241, 237)',
    inversePrimary: 'rgb(113, 218, 166)',
    elevation: {
      level0: 'rgb(255, 255, 255)',
      level1: 'rgb(240, 240, 240)',
      level2: 'rgb(232, 232, 232)',
      level3: 'rgb(216, 216, 216)',
      level4: 'rgb(208, 208, 208)',
      level5: 'rgb(200, 200, 200)',
    },
    surfaceDisabled: 'rgba(25, 28, 26, 0.12)',
    onSurfaceDisabled: 'rgba(25, 28, 26, 0.38)',
    backdrop: 'rgba(42, 50, 45, 0.4)',
  },
  dark: {
    primary: 'rgb(9, 178, 99)',
    onPrimary: 'rgb(0, 56, 35)',
    primaryContainer: 'rgb(0, 82, 52)',
    onPrimaryContainer: 'rgb(142, 247, 193)',
    secondary: 'rgb(248, 189, 42)',
    onSecondary: 'rgb(64, 45, 0)',
    secondaryContainer: 'rgb(92, 67, 0)',
    onSecondaryContainer: 'rgb(255, 223, 160)',
    tertiary: 'rgb(164, 205, 221)',
    onTertiary: 'rgb(5, 53, 66)',
    tertiaryContainer: 'rgb(35, 76, 89)',
    onTertiaryContainer: 'rgb(192, 233, 250)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(25, 28, 26)',
    onBackground: 'rgb(225, 227, 223)',
    surface: 'rgb(25, 28, 26)',
    onSurface: 'rgb(225, 227, 223)',
    surfaceVariant: 'rgb(64, 73, 67)',
    onSurfaceVariant: 'rgb(192, 201, 193)',
    outline: 'rgb(138, 147, 140)',
    outlineVariant: 'rgb(64, 73, 67)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(225, 227, 223)',
    inverseOnSurface: 'rgb(46, 49, 46)',
    inversePrimary: 'rgb(0, 108, 71)',
    elevation: {
      level0: 'rgb(0, 0, 0)',
      level1: 'rgb(8, 8, 8)',
      level2: 'rgb(16, 16, 16)',
      level3: 'rgb(24, 24, 24)',
      level4: 'rgb(64, 64, 64)',
      level5: 'rgb(80, 80, 80)',
    },
    surfaceDisabled: 'rgba(225, 227, 223, 0.12)',
    onSurfaceDisabled: 'rgba(225, 227, 223, 0.38)',
    backdrop: 'rgba(42, 50, 45, 0.4)',
  },
};

function App(): React.JSX.Element {
  const colorScheme = useColorScheme();

  useEffect(() => {
    ReceiveSharingIntent.getReceivedFiles(files => {
      console.log("GOT FILES!!!", files);
    }, 
    (error) =>{
      console.log(error);
    }, 
    'databag'
    );
    return () => {ReceiveSharingIntent.clearReceivedFiles() }
  }, []);

  const theme =
    colorScheme === 'dark'
      ? {...MD3DarkTheme, colors: databagColors.dark}
      : {...MD3LightTheme, colors: databagColors.light};

  barStyle = colorScheme === 'dark' ? 'light-content' : 'dark-content';
  backgroundColor = colorScheme === 'dark' ? databagColors.dark.elevation.level3 : databagColors.light.elevation.level3;

  return (
    <AppContextProvider>
      <DisplayContextProvider>
        <PaperProvider theme={theme}>
          <NativeRouter>
            <StatusBar />
            <Root />
            <Routes>
              <Route path="/" element={<Text>EMPTY</Text>} />
              <Route path="/access" element={<Access />} />
              <Route path="/service" element={<Service />} />
              <Route path="/session" element={<Session />} />
            </Routes>
          </NativeRouter>
        </PaperProvider>
      </DisplayContextProvider>
    </AppContextProvider>
  );
}

export default App;
