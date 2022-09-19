import { useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from 'context/AppContext';
import { useNavigate } from 'react-router-dom';

export function Profile() {

  const app = useContext(AppContext);
  const navigate = useNavigate();

  const logout = () => {
    app.actions.logout();
    navigate('/');
  }

  return (<SafeAreaView edges={['top']}><TouchableOpacity style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={logout}><Text>~ PROFILE LOGOUT</Text></TouchableOpacity></SafeAreaView>)
}

