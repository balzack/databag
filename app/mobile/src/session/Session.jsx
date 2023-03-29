import { useWindowDimensions, View, ScrollView, TouchableOpacity, StatusBar, Text, Image, Modal } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/AntDesign';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSession } from './useSession.hook';
import { styles } from './Session.styled';
import Colors from 'constants/Colors';
import { Profile, ProfileHeader, ProfileBody } from './profile/Profile';
import { CardsHeader, CardsBody, Cards } from './cards/Cards';
import { RegistryHeader, RegistryBody, Registry } from './registry/Registry';
import { ContactHeader, ContactBody, Contact } from './contact/Contact';
import { Details } from './details/Details';
import { Conversation, ConversationHeader, ConversationBody } from './conversation/Conversation';
import { Welcome } from './welcome/Welcome';
import { Channels } from './channels/Channels';
import { CommonActions } from '@react-navigation/native';
import { ConversationContext } from 'context/ConversationContext';
import { ProfileContext } from 'context/ProfileContext';
import { ProfileIcon } from './profileIcon/ProfileIcon';
import { CardsIcon } from './cardsIcon/CardsIcon';
import { Logo } from 'utils/Logo';
import splash from 'images/session.png';
import { RTCView } from 'react-native-webrtc';

const ConversationStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ContactStack = createStackNavigator();
const ProfileDrawer = createDrawerNavigator();
const ContactDrawer = createDrawerNavigator();
const DetailDrawer = createDrawerNavigator();
const CardDrawer = createDrawerNavigator();
const RegistryDrawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function ConversationStackScreen() {
  const stackParams = { headerStyle: { backgroundColor: Colors.titleBackground }, headerBackTitleVisible: false };
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
          {(props) => <Channels navigation={props.navigation} openConversation={(cardId, channelId) => openConversation(props.navigation, cardId, channelId)} />}
        </ConversationStack.Screen>

        <ConversationStack.Screen name="conversation" options={stackParams}>
          {(props) => <Conversation navigation={props.navigation} openDetails={() => openDetails(props.navigation)} closeConversation={(pop) => closeConversation(props.navigation, pop)} /> }
        </ConversationStack.Screen>

        <ConversationStack.Screen name="details" options={{ ...stackParams, headerTitle: (props) => (
            <Text style={styles.headertext}>Details</Text>
        )}}>
          {(props) => <Details clearConversation={() => clearConversation(props.navigation)} />}
        </ConversationStack.Screen>

      </ConversationStack.Navigator>
    </SafeAreaView>
  );
}

function ProfileStackScreen() {
  const stackParams = { headerStyle: { backgroundColor: Colors.titleBackground }, headerBackTitleVisible: false };
  const screenParams = { headerShown: true, headerTintColor: Colors.primary };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.body}>
      <ProfileStack.Navigator screenOptions={({ route }) => (screenParams)}>
        <ProfileStack.Screen name="profile" options={{ ...stackParams, headerTitle: () => <ProfileHeader /> }}>
          {(props) => <ScrollView><ProfileBody /></ScrollView>}
        </ProfileStack.Screen>
      </ProfileStack.Navigator>
    </SafeAreaView>
  );
}

function ContactStackScreen() {
  const stackParams = { headerStyle: { backgroundColor: Colors.titleBackground }, headerBackTitleVisible: false };
  const screenParams = { headerShown: true, headerTintColor: Colors.primary };

  const profile = useContext(ProfileContext);
  
  const [contact, setContact] = useState(null);
  
  const [search, setSearch] = useState(null);
  const [handle, setHandle] = useState();
  const [server, setServer] = useState();

  const [filter, setFilter] = useState();
  const [sort, setSort] = useState(false);

  const openContact = (navigation, contact) => {
    setContact(contact);
    navigation.navigate('contact')
  }
  const openRegistry = (navigation) => {
    setServer(profile.state.identity.node);
    setHandle(null);
    setSearch(false);
    navigation.navigate('registry');
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.body}>
      <ContactStack.Navigator screenOptions={({ route }) => (screenParams)} initialRouteName="cards">

        <ContactStack.Screen name="cards" options={{ ...stackParams, headerTitle: (props) => (
            <CardsHeader filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} openRegistry={openRegistry} />
          )}}>
          {(props) => <CardsBody filter={filter} sort={sort} openContact={(contact) => openContact(props.navigation, contact)} />}
        </ContactStack.Screen>

        <ContactStack.Screen name="contact" options={{ ...stackParams, headerTitle: (props) => (
            <ContactHeader contact={contact} />
          )}}>
          {(props) => <ScrollView><ContactBody contact={contact} /></ScrollView>}
        </ContactStack.Screen>

        <ContactStack.Screen name="registry" options={{ ...stackParams, headerTitle: (props) => (
            <RegistryHeader search={search} setSearch={setSearch} handle={handle} setHandle={setHandle} server={server} setServer={setServer} />
          )}}>
          {(props) => <RegistryBody search={search} handle={handle} server={server} openContact={(contact) => openContact(props.navigation, contact)} />}
        </ContactStack.Screen>

      </ContactStack.Navigator>
    </SafeAreaView>
  );
}

export function Session() {

  const [ringing, setRinging] = useState([]);
  const { state, actions } = useSession();
  const {height, width} = useWindowDimensions();
  const [callWidth, setCallWidth] = useState(0);
  const [callHeight, setCallHeight] = useState(0);

  const drawerParams = { drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front' };

  useEffect(() => {
    console.log(width, height);
    if (width > height) {
      setCallWidth((height * 9)/10);
      setCallHeight((height * 9)/10);
    }
    else {
      setCallWidth((width * 9)/10);
      setCallHeight((width * 9)/10);
    }
  }, [width, height]);

  useEffect(() => {
    console.log("**** REMOTE ****");
    console.log(state.remoteStream);
  }, [state.remoteStream]);

  const HomeScreen = ({ navParams }) => {

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
            <TouchableOpacity style={styles.option} onPress={openProfile}>
              <ProfileIcon color={Colors.text} size={20} />
              <Text style={styles.profileLabel}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={openCards}>
              <CardsIcon color={Colors.text} size={20} />
              <Text style={styles.profileLabel}>Contacts</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.channels}>
            <Channels cardId={cardId} channelId={channelId} openConversation={setConversation} />
          </View>
        </SafeAreaView>
        <View style={styles.conversation}>
          { channel && (
            <SafeAreaView edges={['top', 'bottom', 'right']}>
              <Conversation closeConversation={closeConversation} openDetails={openDetails} />
            </SafeAreaView>
          )}
          { !channel && (
            <Welcome />
          )} 
        </View>
      </View>
    )
  }

  const CardDrawerScreen = ({ navParams }) => {
    const openContact = (contact) => {
      navParams.setContact(contact);
      navParams.contactNav.openDrawer();
    };
    const openRegistry = () => {
      navParams.registryNav.openDrawer();
    };

    return (
      <CardDrawer.Navigator screenOptions={{ ...drawerParams, drawerStyle: { width: '50%' } }} drawerContent={(props) => (
          <SafeAreaView edges={['top', 'bottom', 'right']} style={styles.drawer}>
            <Cards openContact={openContact} openRegistry={openRegistry} />
          </SafeAreaView>
        )}>
        <CardDrawer.Screen name="home">
          {(props) => <HomeScreen navParams={{...navParams, cardNav: props.navigation}} />}
        </CardDrawer.Screen>
      </CardDrawer.Navigator>
    );
  };

  const RegistryDrawerScreen = ({ navParams }) => {
    const openContact = (contact) => {
      navParams.setContact(contact);
      navParams.contactNav.openDrawer();
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

  const ContactDrawerScreen = ({ navParams }) => {
    const [contact, setContact] = useState(null);

    return (
      <ContactDrawer.Navigator screenOptions={{ ...drawerParams, drawerStyle: { width: '44%' } }} drawerContent={(props) => (
          <ScrollView style={styles.drawer}>
            <SafeAreaView edges={['top', 'bottom', 'right']}>
              <Contact contact={contact} />
            </SafeAreaView>
          </ScrollView>
        )}>
        <ContactDrawer.Screen name="registry">
          {(props) => <RegistryDrawerScreen navParams={{...navParams, setContact, contactNav: props.navigation }} />}
        </ContactDrawer.Screen>
      </ContactDrawer.Navigator>
    );
  }

  const DetailDrawerScreen = ({ navParams }) => {
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

  useEffect(() => {
    let incoming = [];
    for (let i = 0; i < state.ringing.length; i++) {
      const { img, name, handle, callId, cardId, contactNode, contactToken, calleeToken } = state.ringing[i];
      const label = name ? name : `${handle}@${contactNode}`;
      const key = `${cardId}:${callId}`
      incoming.push(
        <View key={key} style={styles.ringEntry}>
          <Logo src={img} width={40} height={40} radius={4} />
          <Text style={styles.ringName} numberOfLines={1} ellipsizeMode={'tail'}>{ label }</Text>
          <TouchableOpacity style={styles.ringIgnore} onPress={() => actions.ignore({ cardId, callId })}>
            <MatIcons name={'eye-off-outline'} size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ringDecline} onPress={() => actions.decline({ cardId, contactNode, contactToken, callId })}>
            <MatIcons name={'phone-hangup'} size={20} color={Colors.alert} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ringAccept} onPress={() => actions.accept({ cardId, callId, contactNode, contactToken, calleeToken })}>
            <MatIcons name={'phone'} size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      );
    }
    setRinging(incoming);
  }, [state.ringing]);

  return (
    <NavigationContainer>
      <View style={styles.body}>
        { state.firstRun == true && (
          <SafeAreaView edges={['top', 'bottom']}  style={styles.firstRun}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Welcome To Databag</Text>
              <Text style={styles.tagText}>Communication for the Decentralized Web</Text>
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
          </SafeAreaView>
        )}
        { state.firstRun == false && (
          <View style={styles.container}>
            { state.tabbed === false && (
              <ProfileDrawer.Navigator screenOptions={{ ...drawerParams, drawerStyle: { width: '45%' } }} drawerContent={(props) => (
                  <ScrollView style={styles.drawer}><SafeAreaView edges={['top', 'bottom', 'right']}><Profile /></SafeAreaView></ScrollView>
                )}>
                <ProfileDrawer.Screen name="detail">
                  {(props) => <DetailDrawerScreen navParams={{ profileNav: props.navigation }} />}
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
                    if (route.name === 'Contacts') {
                      return <CardsIcon size={size} color={color} />;
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={ringing.length > 0 && state.callStatus == null}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={styles.ringBase}>
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
        <View style={styles.callBase}>
          <View style={{ ...styles.callFrame, width: callWidth, height: callHeight }}>
            { state.remoteStream && (
              <RTCView
                style={styles.callRemote}
                mirror={true}
                objectFit={'contain'}
                streamURL={state.remoteStream.toURL()}
                zOrder={0}
              />
            )}
            { !state.remoteVideo && (
              <View style={styles.callLogo}>
                <Logo src={state.callLogo} width={callWidth} height={callHeight} radius={4} />
              </View>
            )}
            <View style={styles.callOptions}>
              { !state.localVideo && (
                <TouchableOpacity style={styles.callOption} onPress={actions.enableVideo}>
                  <MatIcons name={'video-outline'} size={20} color={Colors.white} />
                </TouchableOpacity>
              )}
              { state.localVideo && (
                <TouchableOpacity style={styles.callOption} onPress={actions.disableVideo}>
                  <MatIcons name={'video-off-outline'} size={20} color={Colors.white} />
                </TouchableOpacity>
              )}
              { !state.localAudio && (
                <TouchableOpacity style={styles.callOption} onPress={actions.enableVideo}>
                  <MatIcons name={'phone'} size={20} color={Colors.white} />
                </TouchableOpacity>
              )}
              { state.localAudio && (
                <TouchableOpacity style={styles.callOption} onPress={actions.disableVideo}>
                  <MatIcons name={'phone-off'} size={20} color={Colors.white} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.callEnd} onPress={actions.end}>
              <MatIcons name={'phone-hangup'} size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </NavigationContainer>
  );
}



