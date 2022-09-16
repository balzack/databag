import { View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useSession } from './useSession.hook';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export function Session() {

  const { state, actions } = useSession();

  const Tab = createBottomTabNavigator();

  const Home = () => (<TouchableOpacity style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={actions.logout}><Text>LOGOUT</Text></TouchableOpacity>);

  const Settings = () => (<Text>SETTINGS</Text>);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


