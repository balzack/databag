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
import { ProfileTitle, Profile } from './profile/Profile';
import { CardsTitle, CardsBody, Cards } from './cards/Cards';
import { useCards } from './cards/useCards.hook';
import { RegistryTitle, RegistryBody, Registry } from './registry/Registry';
import { useRegistry } from './registry/useRegistry.hook';
import { Contact, ContactTitle } from './contact/Contact';
import { Details } from './details/Details';
import { Conversation } from './conversation/Conversation';
import { Welcome } from './welcome/Welcome';
import { ChannelsTitle, ChannelsBody, Channels } from './channels/Channels';
import { useChannels } from './channels/useChannels.hook';

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

    const [selected, setSelected] = useState(null);
    const setConversation = (navigation, cardId, channelId) => {
      setSelected({ cardId, channelId });
      navigation.navigate('conversation');
    }
    const clearConversation = (navigation) => {
      navigation.goBack();
    }
    const setDetail = (navigation) => {
      navigation.navigate('details');
    }
    const clearDetail = (navigation) => {
      navigation.goBack();
    }

    const channels = useChannels();

    return (
      <ConversationStack.Navigator screenOptions={({ route }) => ({ headerShown: true })}>
        <ConversationStack.Screen name="channels" options={{
            headerStyle: { backgroundColor: Colors.titleBackground }, 
            headerBackTitleVisible: false, 
            headerTitle: (props) => { console.log(props); return <ChannelsTitle state={channels.state} actions={channels.actions} /> }
          }}>
          {(props) => <ChannelsBody state={channels.state} actions={channels.actions} openConversation={(cardId, channelId) => setConversation(props.navigation, cardId, channelId)} />}
        </ConversationStack.Screen>
        <ConversationStack.Screen name="conversation">
          {(props) => <ConversationTabScreen channel={selected} closeConversation={clearConversation} openDetails={setDetail} navigation={props.navigation} />}
        </ConversationStack.Screen>
        <ConversationStack.Screen name="details">
          {(props) => <DetailsTabScreen channel={selected} closeDetails={clearDetail} navigation={props.navigation} />}
        </ConversationStack.Screen>
      </ConversationStack.Navigator>
    );
  }
  const ConversationTabScreen = ({ navigation, channel, closeConversation, openDetails }) => {
    return <Conversation channel={channel} closeConversation={() => closeConversation(navigation)} openDetails={() => openDetails(navigation)} />
  }
  const DetailsTabScreen = ({ navigation, channel, closeDetails }) => {
    return <Details channel={channel} closeDetails={() => closeDetails(navigation)} />
  }
  const ProfileStackScreen = () => {
    return (
      <ProfileStack.Navigator screenOptions={({ route }) => ({ headerShown: true })}>
        <ProfileStack.Screen name="profile" component={Profile} options={{ headerStyle: { backgroundColor: Colors.titleBackground }, headerTitle: (props) => <ProfileTitle {...props} /> }} />
      </ProfileStack.Navigator>
    );
  }
  const ContactStackScreen = () => {
    const [selected, setSelected] = useState(null);
    const setCardStack = (navigation, contact) => {
      setSelected(contact);
      navigation.navigate('contact')
    }
    const clearCardStack = (navigation) => {
      navigation.goBack();
    }
    const setRegistryStack = (navigation) => {
      navigation.navigate('registry');
    }
    const clearRegistryStack = (navigation) => {
      navigation.goBack();
    }

    const registry = useRegistry();
    const cards = useCards();

    return (
      <ContactStack.Navigator screenOptions={({ route }) => ({ headerShow: true })}>
        <ContactStack.Screen name="cards" options={{
            headerStyle: { backgroundColor: Colors.titleBackground }, 
            headerBackTitleVisible: false, 
            headerTitle: (props) => { console.log(props); return <CardsTitle state={cards.state} actions={cards.actions} openRegistry={setRegistryStack} /> }
          }}>
          {(props) => <CardsBody state={cards.state} actions={cards.actions} openContact={(contact) => setCardStack(props.navigation, contact)} />}
        </ContactStack.Screen>
        <ContactStack.Screen name="contact" options={{ 
            headerStyle: { backgroundColor: Colors.titleBackground }, 
            headerBackTitleVisible: false, 
            headerTitle: (props) => <ContactTitle contact={selected} {...props} />
          }}>
          {(props) => <Contact contact={selected} closeContact={() => clearCardStack(props.navigation)} />}
        </ContactStack.Screen>
        <ContactStack.Screen name="registry" options={{
            headerStyle: { backgroundColor: Colors.titleBackground }, 
            headerBackTitleVisible: false,
            headerTitle: (props) => <RegistryTitle state={registry.state} actions={registry.actions} contact={selected} {...props} />
          }}>
          {(props) => <RegistryBody state={registry.state} actions={registry.actions} openContact={(contact) => setCardStack(props.navigation, contact)} />}
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
  const DetailDrawerContent = ({ channel, navigation }) => {
    return (
      <SafeAreaView>
        <Details channel={channel} closeDetails={() => {}} />
      </SafeAreaView>
    )
  }
  const ContactDrawerContent = ({ contact, navigation }) => {
    const clearContact = () => {
      navigation.closeDrawer();
    }

    return (
      <View style={styles.drawer}>
        <Contact contact={contact} closeContact={clearContact} />
      </View>
    )
  }

  const HomeScreen = ({ cardNav, registryNav, detailNav, contactNav, profileNav, setConversation, setDetail }) => {

    const [channel, setChannel] = useState(null);
    const setTopic = (cardId, channelId) => {
      setChannel({ cardId, channelId });
    };
    const clearTopic = () => {
      setChannel(null);
    };

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
            <Channels openConversation={setTopic} />
          </View>
        </SafeAreaView>
        <View style={styles.conversation}>
          { channel && (
            <Conversation channel={channel} closeConversation={clearTopic} openDetails={() => setDetail(detailNav, channel)} />
          )}
          { !channel && (
            <Welcome />
          )} 
        </View>
      </View>
    )
  }

  const CardDrawerScreen = ({ registryNav, detailNav, contactNav, profileNav, setContact, setDetail }) => {

    const openRegistry = () => {
      registryNav.openDrawer();
    }

    return (
      <CardDrawer.Navigator screenOptions={{ drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front', drawerStyle: { width: state.baseWidth } }}
        drawerContent={(props) => <CardDrawerContent setContact={setContact} openRegistry={openRegistry} {...props} />}>
        <CardDrawer.Screen name="home">
          {(props) => <HomeScreen cardNav={props.navigation} registryNav={registryNav} detailNav={detailNav} contactNav={contactNav} profileNav={profileNav} setContact={setContact} setDetail={setDetail} />}
        </CardDrawer.Screen>
      </CardDrawer.Navigator>
    );
  };

  const RegistryDrawerScreen = ({ detailNav, contactNav, profileNav, setContact, setDetail }) => {

    return (
      <RegistryDrawer.Navigator screenOptions={{ drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front', drawerStyle: { width: state.baseWidth } }}
        drawerContent={(props) => <RegistryDrawerContent setContact={setContact} {...props} />}>
        <RegistryDrawer.Screen name="card">
          {(props) => <CardDrawerScreen registryNav={props.navigation} detailNav={detailNav} contactNav={contactNav} profileNav={profileNav} setContact={setContact} setDetail={setDetail} />}
        </RegistryDrawer.Screen>
      </RegistryDrawer.Navigator>
    );
  };

  const ContactDrawerScreen = ({ detailNav, profileNav, setDetail }) => {

    const [selected, setSelected] = useState(null);
    const setContact = (navigation, contact) => {
      setSelected(contact);
      navigation.openDrawer();
    }

    return (
      <ContactDrawer.Navigator screenOptions={{ drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front', drawerStyle: { width: state.subWidth } }}
        drawerContent={(props) => <ContactDrawerContent contact={selected} {...props} />}>
        <ContactDrawer.Screen name="registry">
          {(props) => <RegistryDrawerScreen detailNav={detailNav} profileNav={profileNav} contactNav={props.navigation} setContact={(contact) => setContact(props.navigation, contact)} setDetail={setDetail} />}
        </ContactDrawer.Screen>
      </ContactDrawer.Navigator>
    );
  }

  const DetailDrawerScreen = ({ profileNav }) => {

    const [selected, setSelected] = useState(null);
    const setDetail = (navigation, channel) => {
      setSelected(channel);
      navigation.openDrawer();
    };
  
    return (
      <DetailDrawer.Navigator screenOptions={{ drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front', drawerStyle: { width: state.subWidth } }}
        drawerContent={(props) => <DetailDrawerContent channel={selected} {...props} />}>
        <DetailDrawer.Screen name="contact">
          {(props) => <ContactDrawerScreen profileNav={profileNav} detailNav={props.navigation} setDetail={setDetail} />}
        </DetailDrawer.Screen>
      </DetailDrawer.Navigator>
    );
  }

  return (
    <View style={styles.container}>
      { state.tabbed === false && (
        <ProfileDrawer.Navigator screenOptions={{ drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front', drawerStyle: { width: state.subWidth } }}
          drawerContent={(props) => <ProfileDrawerContent {...props} />}>
          <ProfileDrawer.Screen name="detail">
            {(props) => <DetailDrawerScreen profileNav={props.navigation}/>}
          </ProfileDrawer.Screen>
        </ProfileDrawer.Navigator>
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
    </View>
  );
}


