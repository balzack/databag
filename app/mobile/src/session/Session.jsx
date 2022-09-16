import { View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/AntDesign';
import { useSession } from './useSession.hook';
import { styles } from './Session.styled';
import Colors from 'constants/Colors';

export function Session() {

  const { state, actions } = useSession();

  const Tab = createBottomTabNavigator();

  const Conversation = () => (<TouchableOpacity style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={actions.logout}><Text>LOGOUT</Text></TouchableOpacity>);

  const Profile = () => (<SafeAreaView edges={['top']}><View style={{ width: '100%', height: '100%', backgroundColor: 'yellow'}} /></SafeAreaView>);
  const Contacts = () => (<SafeAreaView edges={['top']}><View style={{ width: '100%', height: '100%', backgroundColor: 'yellow'}} /></SafeAreaView>);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarStyle: styles.tabBar,
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name === 'Profile') {
                return <Ionicons name={'user'} size={size} color={color} />;
              }
              if (route.name === 'Conversation') {
                return <Ionicons name={'message1'} size={size} color={color} />;
              }
              if (route.name === 'Contacts') {
                return <Ionicons name={'contacts'} size={size} color={color} />;
              }
            },
            tabBarActiveTintColor: Colors.white,
            tabBarInactiveTintColor: Colors.disabled,
          })}
            >
          <Tab.Screen name="Conversation" component={Conversation} />
          <Tab.Screen name="Profile" component={Profile} />
          <Tab.Screen name="Contacts" component={Contacts} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


