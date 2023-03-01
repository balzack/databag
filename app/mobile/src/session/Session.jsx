import { View, ScrollView, TouchableOpacity, StatusBar, Text, Image } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/AntDesign';
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

  const drawerParams = { drawerPosition: 'right', headerShown: false, swipeEnabled: false, drawerType: 'front' };
  const stackParams = { headerStyle: { backgroundColor: Colors.titleBackground }, headerBackTitleVisible: false };
  const screenParams = { headerShown: true, headerTintColor: Colors.primary };

  const ConversationStackScreen = () => {
    const [cardId, setCardId] = useState();
    const [channelId, setChannelId] = useState();

    const openConversation = async (navigation, card, channel) => {
      setCardId(card);
      setChannelId(channel);
      navigation.navigate('conversation');
    }
    const closeConversation = (navigation) => {
      setCardId(null);
      setChannelId(null);
      navigation.popToTop();
    }
    const openDetails = (navigation) => {
      navigation.navigate('details');
    }

    return (
      <ConversationStack.Navigator initialRouteName="channels" screenOptions={({ route }) => (screenParams)} >

        <ConversationStack.Screen name="channels" options={stackParams}>
          {(props) => <Channels navigation={props.navigation} openConversation={(cardId, channelId) => openConversation(props.navigation, cardId, channelId)} />}
        </ConversationStack.Screen>

        <ConversationStack.Screen name="conversation" options={stackParams}>
          {(props) => <Conversation navigation={props.navigation} cardId={cardId} channelId={channelId} openDetails={() => openDetails(props.navigation)} closeConversation={closeConversation} /> }
        </ConversationStack.Screen>

        <ConversationStack.Screen name="details" options={{ ...stackParams, headerTitle: (props) => (
            <Text style={styles.headertext}>Details</Text>
        )}}>
          {(props) => <Details clearConversation={() => closeConversation(props.navigation)} />}
        </ConversationStack.Screen>

      </ConversationStack.Navigator>
    );
  }

  const ProfileStackScreen = () => {
    return (
      <ProfileStack.Navigator screenOptions={({ route }) => (screenParams)}>
        <ProfileStack.Screen name="profile" options={{ ...stackParams, headerTitle: () => <ProfileHeader /> }}>
          {(props) => <ScrollView><ProfileBody /></ScrollView>}
        </ProfileStack.Screen>
      </ProfileStack.Navigator>
    );
  }

  const ContactStackScreen = () => {
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
    );
  }

  const HomeScreen = ({ navParams }) => {

    const conversation = useContext(ConversationContext);
    const [channel, setChannel] = useState(false);
    const [cardId, setCardId] = useState();
    const [channelId, setChannelId] = useState();

    const setConversation = (card, channel) => {
      setCardId(card);
      setChannelId(channel);
      setChannel(true);
    };
    const closeConversation = () => {
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
              <Conversation cardId={cardId} channelId={channelId} closeConversation={closeConversation} openDetails={openDetails} />
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
    </NavigationContainer>
  );
}


