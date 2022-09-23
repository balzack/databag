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
import { Registry } from './registry/Registry';
import { Contact } from './contact/Contact';
import { Details } from './details/Details';
import { Conversation } from './conversation/Conversation';
import { Welcome } from './welcome/Welcome';

const ConversationStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ContactStack = createStackNavigator();
const ProfileDrawer = createDrawerNavigator();
const ContactDrawer = createDrawerNavigator();
const DetailDrawer = createDrawerNavigator();
const CardDrawer = createDrawerNavigator();
const RegistryDrawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export function Session() {

  const { state, actions } = useSession();

  const openCards = (nav) => {
    nav.openDrawer();
  }
  const closeCards = (nav) => {}
  const openProfile = (nav) => {
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
      <Channels openConversation={(cardId, channelId) => openConversation(navigation, cardId, channelId)} />
    )
  }
  const ConversationTabScreen = ({ navigation }) => {
    return <Conversation closeConversation={() => closeConversation(navigation)} openDetails={() => openDetails(navigation)} />
  }
  const DetailsTabScreen = ({ navigation }) => {
    return <Details closeDetails={() => closeDetails(navigation)} />
  }
  const ProfileStackScreen = () => {
    return (
      <ProfileStack.Navigator screenOptions={({ route }) => ({ headerShown: false })}>
        <ProfileStack.Screen name="profile" component={Profile} />
      </ProfileStack.Navigator>
    );
  }
  const ContactStackScreen = () => {
    const [cardId, setCardId] = useState(null);
    const setCardStack = (navigation, id) => {
      setCardId(id);
      navigation.navigate('card')
    }
    const clearCardStack = (navigation) => {
      navigation.goBack();
    }

    return (
      <ContactStack.Navigator screenOptions={({ route }) => ({ headerShown: false })}>
        <ContactStack.Screen name="cards">
          {(props) => <Cards openContact={(cardId) => setCardStack(props.navigation, cardId)} />}
        </ContactStack.Screen>
        <ContactStack.Screen name="card">
          {(props) => <Contact cardId={cardId} closeContact={() => clearCardStack(props.navigation)} />}
        </ContactStack.Screen>
      </ContactStack.Navigator>
    );
  }


  // drawered containers
  const CardDrawerContent = ({ navigation, setContact, openRegistry }) => {
    return (
      <SafeAreaView edges={['top']} style={styles.drawer}>
        <Cards navigation={navigation} openContact={setContact} openRegistry={openRegistry} />
      </SafeAreaView>
    )
  }
  const RegistryDrawerContent = ({ navigation, setContact }) => {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.drawer}>
        <Registry navigation={navigation} openContact={setContact} />
      </SafeAreaView>
    );
  }
  const ProfileDrawerContent = ({ navigation }) => {
    return (
      <View style={styles.drawer}>
        <Profile closeProfile={() => closeProfile(navigation)} />
      </View>
    )
  }
  const DetailDrawerContent = ({ navigation }) => {
    return (
      <SafeAreaView>
        <Details closeDetails={() => closeDetails(navigation)} />
      </SafeAreaView>
    )
  }
  const ContactDrawerContent = ({ navigation }) => {
    const clearContact = () => {
      navigation.closeDrawer();
    }

    return (
      <SafeAreaView>
        <Contact closeContact={clearContact} />
      </SafeAreaView>
    )
  }

  const HomeScreen = ({ cardNav, registryNav, detailNav, contactNav, profileNav }) => {
    return (
      <View style={styles.home}>
        <SafeAreaView edges={['top', 'bottom']} style={styles.sidebar}>
          <SafeAreaView edges={['left']} style={styles.options}>
            <TouchableOpacity style={styles.option} onPress={() => openProfile(profileNav)}>
              <Ionicons style={styles.icon} name={'user'} size={20} />
              <Text>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => openCards(cardNav)}>
              <Ionicons style={styles.icon} name={'contacts'} size={20} />
              <Text>Contacts</Text>
            </TouchableOpacity>
          </SafeAreaView>
          <View style={styles.channels}>
            <Channels openConversation={(cardId, channelId) => openConversation(null, cardId, channelId)} />
          </View>
        </SafeAreaView>
        <View style={styles.conversation}>
          { state.conversationId && (
            <Conversation closeConversation={() => closeConversation(null)} openDetails={() => openDetails(detailNav)} />
          )}
          { !state.conversationId && (
            <Welcome />
          )} 
        </View>
      </View>
    )
  }

  const CardDrawerScreen = ({ registryNav, detailNav, contactNav, profileNav, setContact }) => {

    const setCardDrawer = (cardId) => {
      setContact(cardId);
      contactNav.openDrawer();
   }

    const openRegistry = () => {
      registryNav.openDrawer();
    }

    return (
      <CardDrawer.Navigator screenOptions={{ drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front', drawerStyle: { width: state.baseWidth } }}
        drawerContent={(props) => <CardDrawerContent setContact={setCardDrawer} openRegistry={openRegistry} {...props} />}>
        <CardDrawer.Screen name="home">
          {(props) => <HomeScreen cardNav={props.navigation} registryNav={registryNav} detailNav={detailNav} contactNav={contactNav} profileNav={profileNav} />}
        </CardDrawer.Screen>
      </CardDrawer.Navigator>
    );
  };

  const RegistryDrawerScreen = ({ detailNav, contactNav, profileNav, setContact }) => {

    const setRegistryDrawer = (cardId) => {
      setContact(cardId);
      contactNav.openDrawer();
   }

    return (
      <RegistryDrawer.Navigator screenOptions={{ drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front', drawerStyle: { width: state.baseWidth } }}
        drawerContent={(props) => <RegistryDrawerContent setContact={setRegistryDrawer} {...props} />}>
        <RegistryDrawer.Screen name="card">
          {(props) => <CardDrawerScreen registryNav={props.navigation} detailNav={detailNav} contactNav={contactNav} profileNav={profileNav} />}
        </RegistryDrawer.Screen>
      </RegistryDrawer.Navigator>
    );
  };

  const ContactDrawerScreen = ({ detailNav, profileNav }) => {

    const [cardId, setCardId] = useState(null);
    const setContact = (id) => {
      setCardId(id);
    }

    return (
      <ContactDrawer.Navigator screenOptions={{ drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front', drawerStyle: { width: state.subWidth } }}
        drawerContent={(props) => <ContactDrawerContent cardId={cardId} {...props} />}>
        <ContactDrawer.Screen name="registry">
          {(props) => <RegistryDrawerScreen detailNav={detailNav} profileNav={profileNav} contactNav={props.navigation} setContact={setContact} />}
        </ContactDrawer.Screen>
      </ContactDrawer.Navigator>
    );
  }

  const ProfileDrawerScreen = ({ detailNav }) => {
    return (
      <ProfileDrawer.Navigator screenOptions={{ drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front', drawerStyle: { width: state.subWidth } }}
        drawerContent={(props) => <ProfileDrawerContent {...props} />}>
        <ProfileDrawer.Screen name="contact">
          {(props) => <ContactDrawerScreen detailNav={detailNav} profileNav={props.navigation}/>}
        </ProfileDrawer.Screen>
      </ProfileDrawer.Navigator>
    );
  }

  return (
    <View style={styles.container}>
      { state.tabbed === false && (
        <DetailDrawer.Navigator screenOptions={{ drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front', drawerStyle: { width: state.subWidth } }}
          drawerContent={(props) => <DetailDrawerContent {...props} />}>
          <DetailDrawer.Screen name="profile">
            {(props) => <ProfileDrawerScreen detailNav={props.navigation} />}
          </DetailDrawer.Screen>
        </DetailDrawer.Navigator>
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
          <Tab.Screen name="Conversation">
            {(props) => (<SafeAreaView style={styles.tabframe} edges={['top']}><ConversationStackScreen /></SafeAreaView>)}
          </Tab.Screen>
          <Tab.Screen name="Profile">
            {(props) => (<SafeAreaView style={styles.tabframe} edges={['top']}><ProfileStackScreen /></SafeAreaView>)}
          </Tab.Screen>
          <Tab.Screen name="Contacts">
            {(props) => (<SafeAreaView style={styles.tabframe} edges={['top']}><ContactStackScreen /></SafeAreaView>)}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </View>
  );
}


