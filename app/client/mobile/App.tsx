import React, {useState} from 'react';
import {AppContextProvider} from './src/context/AppContext';
import {SettingsContextProvider} from './src/context/SettingsContext';
import {styles} from './App.styled';

import {SafeAreaView, StyleSheet, useColorScheme, View} from 'react-native';
import {
  MD3LightTheme,
  MD3DarkTheme,
  TextInput,
  PaperProvider,
} from 'react-native-paper';

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
    outlineVariant: 'rgb(192, 201, 193)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(46, 49, 46)',
    inverseOnSurface: 'rgb(239, 241, 237)',
    inversePrimary: 'rgb(113, 218, 166)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(238, 246, 239)',
      level2: 'rgb(231, 241, 234)',
      level3: 'rgb(223, 237, 229)',
      level4: 'rgb(221, 236, 227)',
      level5: 'rgb(216, 233, 223)',
    },
    surfaceDisabled: 'rgba(25, 28, 26, 0.12)',
    onSurfaceDisabled: 'rgba(25, 28, 26, 0.38)',
    backdrop: 'rgba(42, 50, 45, 0.4)',
  },
  dark: {
    primary: 'rgb(113, 218, 166)',
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
      level0: 'transparent',
      level1: 'rgb(29, 38, 33)',
      level2: 'rgb(32, 43, 37)',
      level3: 'rgb(35, 49, 41)',
      level4: 'rgb(36, 51, 43)',
      level5: 'rgb(37, 55, 46)',
    },
    surfaceDisabled: 'rgba(225, 227, 223, 0.12)',
    onSurfaceDisabled: 'rgba(225, 227, 223, 0.38)',
    backdrop: 'rgba(42, 50, 45, 0.4)',
  },
};

function App(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const [text, setText] = useState('');

  const theme =
    colorScheme === 'dark'
      ? {...MD3DarkTheme, colors: databagColors.dark}
      : {...MD3LightTheme, colors: databagColors.light};

  return (
    <AppContextProvider>
      <SettingsContextProvider>
        <PaperProvider theme={theme}>
          <SafeAreaView style={{backgroundColor: '#888888'}}>
            <TextInput
              mode="outlined"
              label="Email"
              value={text}
              onChangeText={text => setText(text)}
            />
          </SafeAreaView>
        </PaperProvider>
      </SettingsContextProvider>
    </AppContextProvider>
  );
}

export default App;
