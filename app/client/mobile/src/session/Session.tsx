import {Button} from 'react-native-paper';
import {Text} from 'react-native';
import {AppContext} from '../context/AppContext';
import {View} from 'react-native';
import {useContext} from 'react';

export function Session() {
  const app = useContext(AppContext);

  return (
    <View>
      <Text>SESSION!</Text>
      <Text>SESSION!</Text>
      <Text>SESSION!</Text>
      <Text>SESSION!</Text>
      <Button mode="contained" onPress={app.actions.accountLogout}>
        LOGOUT
      </Button>
    </View>
  );
}
