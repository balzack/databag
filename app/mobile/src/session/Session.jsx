import { TouchableOpacity, Text } from 'react-native';
import { useContext } from 'react';
import { AppContext } from 'context/AppContext';

export function Session() {

  const app = useContext(AppContext);

  return (
    <TouchableOpacity style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={app.actions.logout}><Text>LOGOUT</Text></TouchableOpacity>
  );
}

