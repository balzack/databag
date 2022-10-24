import { View, TouchableOpacity, StatusBar, Text, Image } from 'react-native';
import { useState, useEffect, useContext } from 'react';
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
import { Details, DetailsHeader, DetailsBody } from './details/Details';
import { Conversation, ConversationHeader, ConversationBody } from './conversation/Conversation';
import { Welcome } from './welcome/Welcome';
import { ChannelsTitle, ChannelsBody, Channels } from './channels/Channels';
import { useChannels } from './channels/useChannels.hook';
import { CommonActions } from '@react-navigation/native';
import { ConversationContext } from 'context/ConversationContext';
import { ProfileIcon } from './profileIcon/ProfileIcon';
import { CardsIcon } from './cardsIcon/CardsIcon';
import splash from 'images/session.png';

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
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  // tabbed containers
  const ConversationStackScreen = () => {

    const setConversation = (navigation, cardId, channelId, revision) => {
      navigation.navigate('conversation');
      setSelectedConversation({ cardId, channelId, revision });
    }
    const clearConversation = (navigation) => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'channels' },
          ],
        })
      );
    }
    const setDetail = (navigation) => {
      navigation.navigate('details');
    }
    const clearDetail = (navigation) => {
      navigation.goBack();
    }

    const channels = useChannels();
    const conversation = useContext(ConversationContext);

    useEffect(() => {
      conversation.actions.setChannel(selectedConversation);
    }, [selectedConversation]);      

    return (
      <ConversationStack.Navigator
          initialRouteName="channels"
          screenOptions={({ route }) => ({ headerShown: true, headerTintColor: Colors.primary })}
          screenListeners={{ state: (e) => { if (e?.data?.state?.index === 0 && selectedConversation) { setSelectedConversation(null); }}, }}>
        <ConversationStack.Screen name="channels" options={{
            headerStyle: { backgroundColor: Colors.titleBackground }, 
            headerBackTitleVisible: false, 
            headerTitle: (props) => <ChannelsTitle state={channels.state} actions={channels.actions} />
          }}>
          {(props) => <ChannelsBody state={channels.state} actions={channels.actions} openConversation={(cardId, channelId, revision) => setConversation(props.navigation, cardId, channelId, revision)} />}
        </ConversationStack.Screen>
        <ConversationStack.Screen name="conversation" options={{
            headerStyle: { backgroundColor: Colors.titleBackground }, 
            headerBackTitleVisible: false, 
            headerTitle: (props) => <ConversationHeader channel={selectedConversation} closeConversation={clearConversation} openDetails={setDetail} />
          }}>
          {(props) => <ConversationBody channel={selectedConversation} />}
        </ConversationStack.Screen>
        <ConversationStack.Screen name="details" options={{
            headerStyle: { backgroundColor: Colors.titleBackground }, 
            headerBackTitleVisible: false, 
            headerTitle: (props) => <DetailsHeader channel={selectedConversation} />
          }}>
          {(props) => <DetailsBody channel={selectedConversation} clearConversation={() => clearConversation(props.navigation)} />}
        </ConversationStack.Screen>
      </ConversationStack.Navigator>
    );
  }
  const ProfileStackScreen = () => {
    return (
      <ProfileStack.Navigator screenOptions={({ route }) => ({ headerShown: true, headerTintColor: Colors.primary })}>
        <ProfileStack.Screen name="profile" component={Profile} options={{ headerStyle: { backgroundColor: Colors.titleBackground }, headerTitle: (props) => <ProfileTitle {...props} /> }} />
      </ProfileStack.Navigator>
    );
  }
  const ContactStackScreen = () => {
    const setCardStack = (navigation, contact) => {
      setSelectedContact(contact);
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
      <ContactStack.Navigator screenOptions={({ route }) => ({ headerShow: true, headerTintColor: Colors.primary })}
          initialRouteName="cards">
        <ContactStack.Screen name="cards" options={{
            headerStyle: { backgroundColor: Colors.titleBackground }, 
            headerBackTitleVisible: false, 
            headerTitle: (props) => <CardsTitle state={cards.state} actions={cards.actions} openRegistry={setRegistryStack} />
          }}>
          {(props) => <CardsBody state={cards.state} actions={cards.actions} openContact={(contact) => setCardStack(props.navigation, contact)} />}
        </ContactStack.Screen>
        <ContactStack.Screen name="contact" options={{ 
            headerStyle: { backgroundColor: Colors.titleBackground }, 
            headerBackTitleVisible: false, 
            headerTitle: (props) => <ContactTitle contact={selectedContact} {...props} />
          }}>
          {(props) => <Contact contact={selectedContact} closeContact={() => clearCardStack(props.navigation)} />}
        </ContactStack.Screen>
        <ContactStack.Screen name="registry" options={{
            headerStyle: { backgroundColor: Colors.titleBackground }, 
            headerBackTitleVisible: false,
            headerTitle: (props) => <RegistryTitle state={registry.state} actions={registry.actions} contact={selectedContact} {...props} />
          }}>
          {(props) => <RegistryBody state={registry.state} actions={registry.actions} openContact={(contact) => setCardStack(props.navigation, contact)} />}
        </ContactStack.Screen>
      </ContactStack.Navigator>
    );
  }

  const HomeScreen = ({ cardNav, registryNav, detailNav, contactNav, profileNav, setDetails, resetConversation, clearReset }) => {

    const [channel, setChannel] = useState(null);
    const setConversation = (cardId, channelId, revision) => {
      setChannel({ cardId, channelId, revision });
    };
    const clearConversation = () => {
      setChannel(null);
    };
    const setProfile = () => {
      profileNav.openDrawer();
    };
    const setChannelDetails = (channel) => {
      setDetails(channel);
      detailNav.openDrawer();
    };

    const openProfile = () => {
      profileNav.openDrawer();
    }
    const openCards = () => {
      cardNav.openDrawer();
    }
    const isCardOpen = () => {
      return cardNav.getState().history.length > 1;
    }

    const conversation = useContext(ConversationContext);

    useEffect(() => {
      if (resetConversation) {
        detailNav.closeDrawer();
        setChannel(null);
        setDetails(null);
        clearReset();
      }
    }, [resetConversation]);

    useEffect(() => {
      conversation.actions.setChannel(channel);
    }, [channel]);      

    return (
      <View style={styles.home}>
        <SafeAreaView edges={['top', 'bottom']} style={styles.sidebar}>
          <SafeAreaView edges={['left']} style={styles.options}>
            <TouchableOpacity style={styles.option} onPress={openProfile}>
              <ProfileIcon color={Colors.text} size={20} />
              <Text style={styles.profileLabel}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={openCards}>
              <CardsIcon color={Colors.text} size={20} active={isCardOpen()} />
              <Text style={styles.profileLabel}>Contacts</Text>
            </TouchableOpacity>
          </SafeAreaView>
          <View style={styles.channels}>
            <Channels openConversation={setConversation} />
          </View>
        </SafeAreaView>
        <View style={styles.conversation}>
          { channel && (
            <Conversation closeConversation={clearConversation} openDetails={setChannelDetails} />
          )}
          { !channel && (
            <Welcome />
          )} 
        </View>
      </View>
    )
  }

  const CardDrawerScreen = ({ registryNav, detailNav, contactNav, profileNav, setContact, setDetails, clearReset, resetConversation }) => {

    const openRegistry = () => {
      registryNav.openDrawer();
    };
    setCardContact = (contact) => {
      setContact(contact);
      contactNav.openDrawer();
    };

    const params = {
      profileNav,
      registryNav,
      detailNav,
      contactNav,
      setDetails,
      setContact,
      clearReset,
      resetConversation,
    };

    return (
      <CardDrawer.Navigator screenOptions={{ drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front', drawerStyle: { width: state.baseWidth } }}
        drawerContent={(props) => <Cards openContact={setCardContact} openRegistry={openRegistry} />}>
        <CardDrawer.Screen name="home">
          {(props) => <HomeScreen cardNav={props.navigation} {...params} />}
        </CardDrawer.Screen>
      </CardDrawer.Navigator>
    );
  };

  const RegistryDrawerScreen = ({ detailNav, contactNav, profileNav, setContact, setDetails, clearReset, resetConversation }) => {

    const setRegistryContact = (contact) => {
      setContact(contact);
      contactNav.openDrawer();
    };

    const params = {
      profileNav,
      detailNav,
      contactNav,
      setDetails,
      setContact,
      clearReset,
      resetConversation,
    };

    return (
      <RegistryDrawer.Navigator screenOptions={{ drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front', drawerStyle: { width: state.baseWidth } }}
        drawerContent={(props) => <Registry openContact={setRegistryContact} />}>
        <RegistryDrawer.Screen name="card">
          {(props) => <CardDrawerScreen registryNav={props.navigation} {...params} />}
        </RegistryDrawer.Screen>
      </RegistryDrawer.Navigator>
    );
  };

  const ContactDrawerScreen = ({ detailNav, profileNav, setDetails, resetConversation, clearReset }) => {

    const [selected, setSelected] = useState(null);
    const setContact = (contact) => {
      setSelected(contact);
    }

    const params = {
      profileNav,
      detailNav,
      setDetails,
      setContact,
      clearReset,
      resetConversation,
    };

    return (
      <ContactDrawer.Navigator screenOptions={{ drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front', drawerStyle: { width: state.subWidth } }}
        drawerContent={(props) => <Contact contact={selected} />}>
        <ContactDrawer.Screen name="registry">
          {(props) => <RegistryDrawerScreen {...params} contactNav={props.navigation} setContact={setContact} />}
        </ContactDrawer.Screen>
      </ContactDrawer.Navigator>
    );
  }

  const DetailDrawerScreen = ({ profileNav }) => {

    const [selected, setSelected] = useState(null);
    const [resetConversation, setResetConversation] = useState(false);
    const setDetails = (channel) => {
      setSelected(channel);
    };
    const clearConversation = () => {
      setResetConversation(true);
    }
    const clearReset = () => {
      setResetConversation(false);
    }

    const params = {
      profileNav,
      setDetails,
      clearReset,
      resetConversation,
    };
  
    return (
      <DetailDrawer.Navigator screenOptions={{ drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front', drawerStyle: { width: state.subWidth } }}
          drawerContent={(props) => <Details channel={selected} clearConversation={clearConversation} />}
        >
        <DetailDrawer.Screen name="contact">
          {(props) => <ContactDrawerScreen {...params} detailNav={props.navigation} />}
        </DetailDrawer.Screen>
      </DetailDrawer.Navigator>
    );
  }

  const [cardsActive, setCardsActive] = useState(false);

  return (
    <View style={styles.body}>
      { state.firstRun == true && (
        <View style={styles.firstRun}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Welcome To Databag</Text>
          </View>
          <Image style={styles.splash} source={splash} resizeMode="contain" />
          <View style={styles.steps} >
            <View style={styles.step}>
              <Ionicons name={'user'} size={18} color={Colors.white} />
              <Text style={styles.stepText}>Setup Your Profile</Text>
            </View>
            <View style={styles.step}>
              <Ionicons name={'contacts'} size={18} color={Colors.white} />
              <Text style={styles.stepText}>Connect With People</Text>
            </View>
            <View style={styles.step}>
              <Ionicons name={'message1'} size={18} color={Colors.white} />
              <Text style={styles.stepText}>Start a Conversation</Text>
            </View>
            <TouchableOpacity style={styles.start} onPress={actions.clearFirstRun}>
              <Text style={styles.startText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      { state.firstRun == false && (
        <View style={styles.container}>
          { state.tabbed === false && (
            <ProfileDrawer.Navigator screenOptions={{ drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front', drawerStyle: { width: state.subWidth } }}
              drawerContent={(props) => <Profile />}>
              <ProfileDrawer.Screen name="detail">
                {(props) => <DetailDrawerScreen profileNav={props.navigation}/>}
              </ProfileDrawer.Screen>
            </ProfileDrawer.Navigator>
          )}
          { state.tabbed === true && (
            <Tab.Navigator
              screenListeners={{ state: (e) => setCardsActive(e?.data?.state?.index === 2) }}
              screenOptions={({ route }) => ({
                tabBarStyle: styles.tabBar,
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                  if (route.name === 'Profile') {
                    return <ProfileIcon size={size} color={color} />
                  }
                  if (route.name === 'Conversation') {
                    return <Ionicons name={'message1'} size={size} color={color} />;
                  }
                  if (route.name === 'Contacts') {
                    return <CardsIcon size={size} color={color} active={cardsActive} />;
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
          <StatusBar barStyle="dark-content" backgroundColor={Colors.formBackground} /> 
        </View>
      )}
    </View>
  );
}


