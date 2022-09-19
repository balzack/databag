import { View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/AntDesign';
import { useSession } from './useSession.hook';
import { styles } from './Session.styled';
import Colors from 'constants/Colors';
import { Profile } from './profile/Profile';
import { Channels } from './channels/Channels';
import { Cards } from './cards/Cards';
import { Contact } from './contact/Contact';
import { Details } from './details/Details';
import { Conversation } from './conversation/Conversation';

export function Session() {

  const { state, actions } = useSession();

  const Tab = createBottomTabNavigator();

  const openCards = (nav) => {}
  const closeCards = (nav) => {}
  const openProfile = (nav) => {}
  const closeProfile = (nav) => {}
  const openContact = (nav, cardId) => {}
  const closeContact = (nav) => {}
  const openConversation = (nav, channelId) => {}
  const closeConversation = (nav) => {}


  // tabbed containers
  const ConversationStack = createStackNavigator();
  const ConversationStackScreen = () => {
    return (
      <ConversationStack.Navigator screenOptions={({ route }) => ({ headerShown: false })}>
        <ConversationStack.Screen name="channels" component={ChannelsTabScreen} />
        <ConversationStack.Screen name="details" component={DetailsTabScreen} />
      </ConversationStack.Navigator>
    );
  }
  const ChannelsTabScreen = ({ navigation }) => {
    return <Channels
      openConversation={(channelId) => openConversation(navigation, channelId)}
      openProfile={() => openProfile(navigation)}
    />
  }
  const DetailsTabScreen = ({ navigation }) => {
    return <Details closeDetails={() => closeDetails(navigation)} />
  }
  const ProfileStack = createStackNavigator();
  const ProfileStackScreen = () => {
    return (
      <ProfileStack.Navigator screenOptions={({ route }) => ({ headerShown: false })}>
        <ProfileStack.Screen name="profile" component={Profile} />
      </ProfileStack.Navigator>
    );
  }
  const ContactStack = createStackNavigator();
  const ContactStackScreen = () => {
    return (
      <ContactStack.Navigator screenOptions={({ route }) => ({ headerShown: false })}>
        <ContactStack.Screen name="cards" component={ContactsTabScreen} />
        <ContactStack.Screen name="card" component={ContactTabScreen} />
      </ContactStack.Navigator>
    );
  }
  const ContactsTabScreen = ({ navigation }) => {
    return <Cards openContact={(cardId) => openContact(navigation, cardId)} />
  }
  const ContactTabScreen = ({ navigation }) => {
    return <Contact closeContact={() => closeContact(navigation)} />
  }


  // drawered containers


  const CardDrawer = createDrawerNavigator();
  const CardDrawerContent = ({ otherNav, navigation }) => {
    return (
      <SafeAreaView><TouchableOpacity onPress={() => otherNav.openDrawer()}><Text>CARD DRAWER</Text></TouchableOpacity></SafeAreaView>
    )
  }

  const ContactDrawer = createDrawerNavigator();
  const ContactDrawerContent = ({ navigation }) => {
    return (
      <SafeAreaView><Text>Contact DRAWER</Text></SafeAreaView>
    )
  }
  const HomeScreen = ({ otherNav, navigation }) => {
    return (
      <SafeAreaView>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Text>OPEN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => otherNav.openDrawer()}>
          <Text>OTHER</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  const CardDrawerScreen = ({ navigation }) => {
    return (
      <CardDrawer.Navigator screenOptions={{ 
            drawerPosition: 'right',
            headerShown: false,
            swipeEnabled: false,
            drawerType: 'front',
            drawerStyle: {
              width: state.cardWidth,
            },
          }}
          drawerContent={(props) => <CardDrawerContent otherNav={navigation}  {...props} />}>
        <CardDrawer.Screen name="Root">
          {(props) => <HomeScreen otherNav={navigation} {...props} />}
        </CardDrawer.Screen>
      </CardDrawer.Navigator>
    );
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        { state.tabbed === false && (
          <ContactDrawer.Navigator
            screenOptions={{
              headerShown: false,
              swipeEnabled: false,
              drawerType: 'front',
              drawerPosition: 'right',
              drawerStyle: {
                width: state.profileWidth,
              }
            }}
            drawerContent={(props) => <ContactDrawerContent {...props} />}>
            <ContactDrawer.Screen name="Home" component={CardDrawerScreen} />
          </ContactDrawer.Navigator>
        )}
        { state.tabbed === true && (
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
            })}>
            <Tab.Screen name="Conversation" component={ConversationStackScreen} />
            <Tab.Screen name="Profile" component={ProfileStackScreen} />
            <Tab.Screen name="Contacts" component={ContactStackScreen} />
          </Tab.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


