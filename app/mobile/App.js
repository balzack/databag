import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppContextProvider } from './context/AppContext';

export default function App() {
  return (
    <AppContextProvider>
    <View style={styles.container}>
      <Text>Open App.js to start working on your app!</Text>
    </View>
    </AppContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
