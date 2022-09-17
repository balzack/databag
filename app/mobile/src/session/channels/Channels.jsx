import { useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from 'context/AppContext';

export function Channels() {

  const app = useContext(AppContext);

  return (<SafeAreaView edges={['top']}><TouchableOpacity style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={app.actions.logout}><Text>~ CHANNELS LOGOUT</Text></TouchableOpacity></SafeAreaView>)
}

