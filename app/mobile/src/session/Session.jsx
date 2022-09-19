import { View, TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';
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
import { Welcome } from './welcome/Welcome';

export function Session() {

  const { state, actions } = useSession();
  const [ contactDrawer, setContactDrawer ] = useState(null);
  const Tab = createBottomTabNavigator();

  const openCards = (nav) => {
    nav.openDrawer();
  }
  const closeCards = (nav) => {}
  const openProfile = (nav) => {
    setContactDrawer('profile');
    nav.openDrawer();
  }
  const closeProfile = (nav) => {}
  const openContact = (nav, cardId) => {}
  const closeContact = (nav) => {}
  const openConversation = (nav, cardId, channelId) => {}
  const closeConversation = (nav) => {}
  const openDetails = (nav, cardId, channeId) => {}
  const closeDetails = (nav) => {}

  // tabbed containers
  const ConversationStack = createStackNavigator();
  const ConversationStackScreen = () => {
    return (
      <ConversationStack.Navigator screenOptions={({ route }) => ({ headerShown: false })}>
        <ConversationStack.Screen name="channels" component={ChannelsTabScreen} />
        <ConversationStack.Screen name="conversation" component={ConversationTabScreen} />
        <ConversationStack.Screen name="details" component={DetailsTabScreen} />
      </ConversationStack.Navigator>
    );
  }
  const ChannelsTabScreen = ({ navigation }) => {
    return (
      <SafeAreaView style={styles.channels} edges={['top']}>
        <Channels openConversation={(cardId, channelId) => openConversation(navigation, cardId, channelId)} />
      </SafeAreaView>
    )
  }
  const ConversationTabScreen = ({ navigation }) => {
    return <Conversation closeConversation={() => closeConversation(navigation)} openDetails={() => openDetails(navigation)} />
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
  const CardDrawerContent = ({ contactNav, navigation }) => {
    return (
      <SafeAreaView>
        <Cards openContact={(cardId) => openContact(contactNav, cardId)} />
      </SafeAreaView>
    )
  }
  const ContactDrawer = createDrawerNavigator();
  const ContactDrawerContent = ({ navigation }) => {
    return (
      <SafeAreaView>
        { contactDrawer === 'profile' && (
          <Profile closeProfile={() => closeProfile(navigation)} />
        )}
        { contactDrawer === 'contacts' && (
          <Contact closeContact={() => closeContact(navigation)} />
        )}
        { contactDrawer === 'details' && (
          <Details closeDetails={() => closeDetails(navigation)} />
        )}
      </SafeAreaView>
    )
  }
  const HomeScreen = ({ contactNav, navigation }) => {
    return (
      <View style={styles.home}>
        <View style={styles.sidebar}>
          <SafeAreaView edges={['top', 'left']} style={styles.options}>
            <TouchableOpacity style={styles.option} onPress={() => openProfile(contactNav)}>
              <Ionicons style={styles.icon} name={'user'} size={20} />
              <Text>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => openCards(navigation)}>
              <Ionicons style={styles.icon} name={'contacts'} size={20} />
              <Text>Contacts</Text>
            </TouchableOpacity>
          </SafeAreaView>
          <SafeAreaView edges={['left', 'bottom']} style={styles.channels}>
            <Channels openConversation={(cardId, channelId) => openConversation(null, cardId, channelId)} />
          </SafeAreaView>
        </View>
        <View style={styles.conversation}>
          { state.conversationId && (
            <Conversation closeConversation={() => closeConversation(null)} openDetails={() => openDetails(contactNav)} />
          )}
          { !state.conversationId && (
            <Welcome />
          )} 
        </View>
      </View>
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
          drawerContent={(props) => <CardDrawerContent contactNav={navigation}  {...props} />}>
        <CardDrawer.Screen name="Root">
          {(props) => <HomeScreen contactNav={navigation} {...props} />}
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


