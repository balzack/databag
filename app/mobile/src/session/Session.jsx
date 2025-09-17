import { Alert, View, ScrollView, TouchableOpacity, StatusBar, Text, Image, Modal, Appearance } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DarkTheme, LightTheme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/AntDesign';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSession } from './useSession.hook';
import { styles } from './Session.styled';
import Colors from 'constants/Colors';
import { Profile } from './profile/Profile';
import { ProfileSettings } from './profileSettings/ProfileSettings';
import { Cards } from './cards/Cards';
import { RegistryHeader, RegistryBody, Registry } from './registry/Registry';
import { Contact } from './contact/Contact';
import { Details } from './details/Details';
import { Conversation, ConversationHeader, ConversationBody } from './conversation/Conversation';
import { Welcome } from './welcome/Welcome';
import { Settings } from './settings/Settings';
import { Channels } from './channels/Channels';
import { CommonActions } from '@react-navigation/native';
import { ConversationContext } from 'context/ConversationContext';
import { ProfileContext } from 'context/ProfileContext';
import { ProfileIcon } from './profileIcon/ProfileIcon';
import { CardsIcon } from './cardsIcon/CardsIcon';
import { Logo } from 'utils/Logo';
import { Call } from './call/Call';
import { Sharing } from './sharing/Sharing';
import lightSplash from 'images/session.png';
import darkSplash from 'images/darksess.png';
import { useNavigate } from 'react-router-dom';
import { getLanguageStrings } from 'constants/Strings';

const ConversationStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const ContactStack = createStackNavigator();
const ProfileDrawer = createDrawerNavigator();
const ContactDrawer = createDrawerNavigator();
const DetailDrawer = createDrawerNavigator();
const CardDrawer = createDrawerNavigator();
const RegistryDrawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function ConversationStackScreen({ dmChannel, shareChannel, shareIntent, setShareIntent }) {
  const stackParams = { headerStyle: { backgroundColor: Colors.screenBase, borderBottomWidth: 0.5, borderBottomColor: Colors.horizontalDivider }, headerBackTitleVisible: false, cardStyle: {backgroundColor: Colors.screenBase }};
const screenParams = { headerShown: true, headerTintColor: Colors.primary };

  const conversation = useContext(ConversationContext);
  const [cardId, setCardId] = useState();
  const [channelId, setChannelId] = useState();

  const openConversation = (navigation, card, channel) => {
    (async () => {
      conversation.actions.setConversation(card, channel);
      setCardId(card);
      setChannelId(channel);
      navigation.navigate('conversation');
    })();
  };
  const clearConversation = (navigation) => {
    conversation.actions.clearConversation();
    setCardId(null);
    setChannelId(null);
    navigation.popToTop();
  };
  const closeConversation = () => {
    conversation.actions.clearConversation();
    setCardId(null);
    setChannelId(null);
  }

  const openDetails = (navigation) => {
    navigation.navigate('details');
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.body}>
      <ConversationStack.Navigator initialRouteName="channels" screenOptions={({ route }) => (screenParams)} >

        <ConversationStack.Screen name="channels" options={stackParams}>
          {(props) => <Channels navigation={props.navigation} dmChannel={dmChannel} shareChannel={shareChannel} openConversation={(cardId, channelId) => openConversation(props.navigation, cardId, channelId)} />}
        </ConversationStack.Screen>

        <ConversationStack.Screen name="conversation" options={stackParams}>
          {(props) => <Conversation navigation={props.navigation} openDetails={() => openDetails(props.navigation)} closeConversation={(pop) => closeConversation(props.navigation, pop)} shareIntent={shareIntent} setShareIntent={setShareIntent} /> }
        </ConversationStack.Screen>

        <ConversationStack.Screen name="details" options={{ ...stackParams, headerTitle: (props) => (
            <Text style={styles.headertext}></Text>
        )}}>
          {(props) => <Details clearConversation={() => clearConversation(props.navigation)} />}
        </ConversationStack.Screen>

      </ConversationStack.Navigator>
    </SafeAreaView>
  );
}

function SettingsStackScreen() {
  const stackParams = { headerBackTitleVisible: false };
  const screenParams = { headerShown: false };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.body}>
      <SettingsStack.Navigator screenOptions={({ route }) => (screenParams)}>
        <SettingsStack.Screen name="settings" options={stackParams}>
          {(props) => <Settings />}
        </SettingsStack.Screen>
      </SettingsStack.Navigator>
    </SafeAreaView>
  );
}

function ProfileStackScreen() {
  const stackParams = { headerBackTitleVisible: false };
  const screenParams = { headerShown: false };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.body}>
      <ProfileStack.Navigator screenOptions={({ route }) => (screenParams)}>
        <ProfileStack.Screen name="profile" options={stackParams}>
          {(props) => <Profile />}
        </ProfileStack.Screen>
      </ProfileStack.Navigator>
    </SafeAreaView>
  );
}

function ContactStackScreen({ addChannel }) {
  const stackParams = { headerStyle: { backgroundColor: Colors.screenBase, borderBottomWidth: 0.2, borderBottomColor: Colors.horizontalDivider }, headerBackTitleVisible: false };
  const screenParams = { headerShown: true, headerTintColor: Colors.primary };

  const profile = useContext(ProfileContext);
  
  const [contact, setContact] = useState(null);
  
  const [editable, setEditable] = useState(false);
  const [search, setSearch] = useState(null);
  const [handle, setHandle] = useState();
  const [server, setServer] = useState();

  const openContact = (navigation, contact) => {
    setContact(contact);
    navigation.navigate('contact')
  }
  const openRegistry = (navigation) => {
    if (profile.state.identity?.node) {
      setEditable(true);
    }
    else {
      setEditable(false);
    }
    setServer(profile.state.server);
    setHandle(null);
    setSearch(false);
    navigation.navigate('registry');
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.body}>
      <ContactStack.Navigator screenOptions={({ route }) => (screenParams)} initialRouteName="cards">

        <ContactStack.Screen name="cards" options={stackParams}>
          {(props) => <Cards navigation={props.navigation} openContact={(contact) => openContact(props.navigation, contact)} openRegistry={openRegistry} addChannel={addChannel} />}
        </ContactStack.Screen>

        <ContactStack.Screen name="contact" options={{ headerShown: false }}>
          {(props) => <Contact contact={contact} back={props.navigation.goBack} />}
        </ContactStack.Screen>

        <ContactStack.Screen name="registry" options={{ ...stackParams, cardStyle: {backgroundColor: Colors.screenBase}, headerTitle: (props) => (
            <RegistryHeader search={search} editable={editable} setSearch={setSearch} handle={handle} setHandle={setHandle} server={server} setServer={setServer} />
          )}}>
          {(props) => <RegistryBody search={search} handle={handle} server={server} openContact={(contact) => openContact(props.navigation, contact)} />}
        </ContactStack.Screen>

      </ContactStack.Navigator>
    </SafeAreaView>
  );
}

function HomeScreen({ navParams }) {

  const strings = getLanguageStrings();
  const drawerParams = { drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front' };
  const conversation = useContext(ConversationContext);
  const [channel, setChannel] = useState(false);
  const [cardId, setCardId] = useState();
  const [channelId, setChannelId] = useState();

  const setConversation = (card, channel) => {
    (async () => {
      conversation.actions.setConversation(card, channel);
      setCardId(card);
      setChannelId(channel);
      setChannel(true);
      navParams.cardNav.closeDrawer();
    })();
  };
  const closeConversation = () => {
    conversation.actions.clearConversation();
    setCardId(null);
    setChannelId(null);
    setChannel(false);
  };
  const openDetails = () => {
    navParams.detailNav.openDrawer();
  };
  const openProfile = () => {
    navParams.profileNav.openDrawer();
  }
  const openCards = () => {
    navParams.cardNav.openDrawer();
  }

  useEffect(() => {
    navParams.detailNav.closeDrawer();
    setChannelId(null);
    setCardId(null);
    setChannel(false);
  }, [navParams.closeCount]);

  return (
    <View style={styles.home}>
      <SafeAreaView edges={['top', 'bottom', 'left']} style={styles.sidebar}>
        <View edges={['left']} style={styles.options}>
          <TouchableOpacity style={styles.option} onPress={openProfile} activeOpacity={1}>
            <ProfileIcon color={Colors.text} size={24} />
            <Text style={styles.profileLabel}>{ strings.account }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={openCards} activeOpacity={1}>
            <CardsIcon color={Colors.text} size={24} />
            <Text style={styles.profileLabel}>{ strings.contacts }</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.channels}>
          <Channels dmChannel={navParams.dmChannel} shareChannel={navParams.shareChannel} cardId={cardId} channelId={channelId} openConversation={setConversation} />
        </View>
      </SafeAreaView>
      <View style={styles.conversation}>
        { channel && (
          <SafeAreaView edges={['top', 'bottom', 'right']}>
            <Conversation closeConversation={closeConversation} openDetails={openDetails} shareIntent={navParams.shareIntent} setShareIntent={navParams.setShareIntent} />
          </SafeAreaView>
        )}
        { !channel && (
          <Welcome />
        )} 
      </View>
    </View>
  )
}

function CardDrawerScreen({ navParams }) {
  const drawerParams = { drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front' };
  const [dmChannel, setDmChannel] = useState(null);
  const openContact = (contact) => {
    navParams.setContact(contact);
    setTimeout(() => {
      navParams.contactNav.openDrawer();
    });
  };
  const openRegistry = () => {
    navParams.registryNav.openDrawer();
  };

  return (
    <CardDrawer.Navigator screenOptions={{ ...drawerParams, drawerStyle: { width: '50%' } }} drawerContent={(props) => (
        <SafeAreaView edges={['top', 'bottom', 'right']} style={styles.drawer}>
          <Cards openContact={openContact} openRegistry={openRegistry} addChannel={navParams.addChannel} />
        </SafeAreaView>
      )}>
      <CardDrawer.Screen name="home">
        {(props) => <HomeScreen navParams={{...navParams, cardNav: props.navigation}} />}
      </CardDrawer.Screen>
    </CardDrawer.Navigator>
  );
};

function RegistryDrawerScreen({ navParams }) {
  const drawerParams = { drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front' };
  const openContact = (contact) => {
    navParams.setContact(contact);
    setTimeout(() => {
      navParams.contactNav.openDrawer();
    });
  };

  return (
    <RegistryDrawer.Navigator screenOptions={{ ...drawerParams, drawerStyle: { width: '47%' } }} drawerContent={(props) => (
        <SafeAreaView edges={['top', 'bottom', 'right']} style={styles.drawer}>
          <Registry openContact={openContact} />
        </SafeAreaView>
      )}>
      <RegistryDrawer.Screen name="card">
        {(props) => <CardDrawerScreen navParams={{...navParams, registryNav: props.navigation}} />}
      </RegistryDrawer.Screen>
    </RegistryDrawer.Navigator>
  );
};

function ContactDrawerScreen({ navParams }) {
  const drawerParams = { drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front' };
  const [contact, setContact] = useState(null);

  return (
    <ContactDrawer.Navigator screenOptions={{ ...drawerParams, drawerStyle: { width: '44%' } }} drawerContent={(props) => (
        <ScrollView style={styles.drawer}>
          <SafeAreaView edges={['top', 'bottom', 'right']}>
            <Contact contact={contact} drawer={true} back={props.navigation.goBack} />
          </SafeAreaView>
        </ScrollView>
      )}>
      <ContactDrawer.Screen name="registry">
        {(props) => <RegistryDrawerScreen navParams={{...navParams, setContact, contactNav: props.navigation }} />}
      </ContactDrawer.Screen>
    </ContactDrawer.Navigator>
  );
}

function DetailDrawerScreen({ navParams }) {
  const drawerParams = { drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front' };
  const [closeCount, setCloseCount] = useState(0);
  const clearConversation = (navigation) => {
    setCloseCount(closeCount+1);
  };

  return (
    <DetailDrawer.Navigator screenOptions={{ ...drawerParams, drawerStyle: { width: '45%' } }} drawerContent={(props) => (
        <SafeAreaView style={styles.drawer} edges={['top', 'bottom', 'right']}>
          <Details clearConversation={() => clearConversation(props.navigation)} />
        </SafeAreaView>
      )}>
      <DetailDrawer.Screen name="contact">
        {(props) => <ContactDrawerScreen navParams={{...navParams, closeCount: closeCount, detailNav: props.navigation}} />}
      </DetailDrawer.Screen>
    </DetailDrawer.Navigator>
  );
}

export function Session({ sharing, clearSharing }) {

  const [intent, setIntent] = useState(sharing)
  const [ringing, setRinging] = useState([]);
  const { state, actions } = useSession();
  const drawerParams = { drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front' };
  const navigate = useNavigate();

  const [ dmChannel, setDmChannel ] = useState(null);
  const addChannel = async (cardId) => {
    const id = await actions.setDmChannel(cardId);
    setDmChannel({ id });
  };

  const [shareIntent, setShareIntent] = useState(null);
  const [shareChannel, setShareChannel] = useState(null);
  const setShare = async ({ cardId, channelId }) => {
    setShareIntent(sharing);
    setShareChannel({ cardId, channelId });
    clearSharing();
  }
  const clearShare = async () => {
    clearSharing();
  }

  useEffect(() => {
    if (sharing != intent && sharing != null) {
      navigate('/');
    }
  }, [sharing, intent, navigate])

  useEffect(() => {
    let incoming = [];
    for (let i = 0; i < state.ringing.length; i++) {
      const call = state.ringing[i];
      const { img, cardId, callId, name, handle, contactNode } = call || {};
      const key = `${cardId}:${callId}`
      incoming.push(
        <View key={key} style={styles.ringEntry}>
          <Logo src={img} width={40} height={40} radius={4} />
          { name != null && (
            <Text style={styles.ringName} numberOfLines={2} ellipsizeMode={'tail'}>{ name }</Text>
          )}
          { name == null && contactNode != null && (
            <View style={styles.ringName}>
              <Text style={styles.ringText} numberOfLines={1} ellipsizeMode={'tail'}>{ handle }</Text>
              <Text styles={styles.ringText} numberOfLines={1} ellipsizeMode={'tail'}>{ contactNode }</Text>
            </View>
          )}
          { name == null && contactNode == null && (
            <Text style={styles.ringName} numberOfLines={1} ellipsizeMode={'tail'}>{ handle }</Text>
          )}
          <TouchableOpacity style={styles.ringIgnore} onPress={() => actions.ignore({ cardId, callId })}>
            <MatIcons name={'eye-off-outline'} size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ringDecline} onPress={() => actions.decline(call)}>
            <MatIcons name={'phone-hangup'} size={20} color={Colors.alert} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ringAccept} onPress={() => actions.accept(call)}>
            <MatIcons name={'phone'} size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      );
    }
    setRinging(incoming);
  }, [state.ringing]);

  return (
    <NavigationContainer theme={Appearance.getColorScheme() === 'dark' ? DarkTheme : LightTheme}>
      <View style={styles.body}>
        { state.firstRun == true && (
          <SafeAreaView edges={['top', 'bottom']}  style={styles.firstRun}>
            <View style={styles.title}>
              <Text style={styles.titleText}>{ state.strings.welcome }</Text>
              <Text style={styles.tagText}>{ state.strings.communication }</Text>
            </View>
            { Colors.theme === 'dark' && (
              <Image style={styles.splash} source={darkSplash} resizeMode="contain" />
            )}
            { Colors.theme !== 'dark' && (
              <Image style={styles.splash} source={lightSplash} resizeMode="contain" />
            )}
            <View style={styles.steps} >
              <View style={styles.step}>
                <Ionicons name={'user'} size={18} color={Colors.white} />
                <Text style={styles.stepText}>{ state.strings.setup }</Text>
              </View>
              <View style={styles.step}>
                <Ionicons name={'contacts'} size={18} color={Colors.white} />
                <Text style={styles.stepText}>{ state.strings.connect }</Text>
              </View>
              <View style={styles.step}>
                <Ionicons name={'message1'} size={18} color={Colors.white} />
                <Text style={styles.stepText}>{ state.strings.start }</Text>
              </View>
              <TouchableOpacity style={styles.start} onPress={actions.clearFirstRun}>
                <Text style={styles.startText}>{ state.strings.started }</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )}
        { state.firstRun == false && (
          <View style={styles.container}>
            { state.tabbed === false && (
              <ProfileDrawer.Navigator screenOptions={{ ...drawerParams, drawerStyle: { width: '45%' } }} drawerContent={(props) => (
                  <ProfileSettings />
                )}>
                <ProfileDrawer.Screen name="detail">
                  {(props) => <DetailDrawerScreen navParams={{ profileNav: props.navigation, state, actions, addChannel, dmChannel, shareChannel, shareIntent, setShareIntent }} />}
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
                      return <ProfileIcon size={size} color={color} />
                    }
                    if (route.name === 'Conversation') {
                      return <Ionicons name={'message1'} size={size} color={color} />;
                    }
                    if (route.name === 'Settings') {
                      return <Ionicons name={'setting'} size={size} color={color} />;
                    }
                    if (route.name === 'Contacts') {
                      return <CardsIcon size={size} color={color} />;
                    }
                  },
                  tabBarShowLabel: false,
                  tabBarActiveTintColor: Colors.activeTabIcon,
                  tabBarInactiveTintColor: Colors.idleTabIcon,
                })}>
                <Tab.Screen name="Conversation" children={()=><ConversationStackScreen dmChannel={dmChannel} shareChannel={shareChannel} shareIntent={shareIntent} setShareIntent={setShareIntent} />} />
                <Tab.Screen name="Contacts" children={()=><ContactStackScreen addChannel={addChannel} />} />
                <Tab.Screen name="Profile" component={ProfileStackScreen} />
                <Tab.Screen name="Settings" component={SettingsStackScreen} />
              </Tab.Navigator>
            )}
            <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.screenBase} /> 
          </View>
        )}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={ringing.length > 0 && state.callStatus == null}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={styles.ringBase}>
          <View style={styles.blur} />
          <View style={styles.ringFrame}>
            { ringing }
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.callStatus != null}
        supportedOrientations={['portrait', 'landscape']}
      >
        <Call />
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={sharing != null && intent != null}
        supportedOrientations={['portrait', 'landscape']}
      >
        <Sharing select={setShare} cancel={clearShare} />
      </Modal>
    </NavigationContainer>
  );
}



