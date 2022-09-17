import { View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/AntDesign';
import { useSession } from './useSession.hook';
import { styles } from './Session.styled';
import Colors from 'constants/Colors';
import { Profile } from './profile/Profile';
import { Channels } from './channels/Channels';
import { Cards } from './cards/Cards';

export function Session() {

  const { state, actions } = useSession();

  const Tab = createBottomTabNavigator();

  const ConversationStack = createStackNavigator();
  const ConversationStackScreen = () => {
    return (
      <ConversationStack.Navigator screenOptions={({ route }) => ({ headerShown: false })}>
        <ConversationStack.Screen name="channels" component={Channels} />
      </ConversationStack.Navigator>
    );
  }

  const ProfileStack = createStackNavigator();
  const ProfileStackScreen = () => {
    return (
      <ProfileStack.Navigator screenOptions={({ route }) => ({ headerShown: false })}>
        <ProfileStack.Screen name="channels" component={Profile} />
      </ProfileStack.Navigator>
    );
  }

  const ContactStack = createStackNavigator();
  const ContactStackScreen = () => {
    return (
      <ContactStack.Navigator screenOptions={({ route }) => ({ headerShown: false })}>
        <ContactStack.Screen name="channels" component={Cards} />
      </ContactStack.Navigator>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        { state.tabbed && (
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
              tabBarShowLabel: false,
              tabBarActiveTintColor: Colors.white,
              tabBarInactiveTintColor: Colors.disabled,
            })}
              >
            <Tab.Screen name="Conversation" component={ConversationStackScreen} />
            <Tab.Screen name="Profile" component={ProfileStackScreen} />
            <Tab.Screen name="Contacts" component={ContactStackScreen} />
          </Tab.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


