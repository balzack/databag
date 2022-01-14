/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

const App: () => Node = () => {

  const test = () => {
    console.log("PRESSED: 7000");
    var ws = new WebSocket('ws://192.168.13.233:7000/status');
    ws.onerror = (e) => {
      console.log("error: ", e);
    }
    ws.onmessage = (e) => {
      console.log("message: ", e);
    }
    ws.onclose = (e) => {
      console.log("close: ", e);
    }
    ws.onopen = (e) => {
      console.log("connected");
      ws.send('something');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="TEST" onPress={test} />
      </View>
    </SafeAreaView>
  );
};

export default App;
