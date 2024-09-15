import React, {useContext} from 'react';
import {AppContext} from '../context/AppContext';
import {Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native';

export function Settings() {
  const app = useContext(AppContext);

  return (
    <SafeAreaView>
      <Button mode="contained" onPress={app.actions.accountLogout}>
        Logout
      </Button>
    </SafeAreaView>
  );
}
