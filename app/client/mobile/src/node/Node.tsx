import {Button} from 'react-native-paper';
import {Text} from 'react-native';
import {AppContext} from '../context/AppContext';
import {View} from 'react-native';
import React, {useContext} from 'react';

export function Node() {
  const app = useContext(AppContext);

  return (
    <View>
      <Text>NODE!</Text>
      <Text>NODE!</Text>
      <Text>NODE!</Text>
      <Text>NODE!</Text>
      <Button mode="contained" onPress={app.actions.adminLogout}>
        LOGOUT
      </Button>
    </View>
  );
}
