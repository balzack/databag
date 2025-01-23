import React, {useState, useCallback, useEffect} from 'react';
import {SafeAreaView, Pressable, View, useColorScheme} from 'react-native';
import {styles} from './Session.styled';
import {IconButton, Surface, Text, Icon} from 'react-native-paper';
import {Settings} from '../settings/Settings';
import {Contacts} from '../contacts/Contacts';
import {Content} from '../content/Content';
import {Registry} from '../registry/Registry';
import {Profile, ContactParams} from '../profile/Profile';
import {Details} from '../details/Details';
import {Identity} from '../identity/Identity';
import {Conversation} from '../conversation/Conversation';
import {useSession} from './useSession.hook';
import {TransitionPresets} from '@react-navigation/stack';
import {Focus} from 'databag-client-sdk';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Colors} from '../constants/Colors';
import {Calling} from '../calling/Calling';

const SettingsDrawer = createDrawerNavigator();
const ContactsDrawer = createDrawerNavigator();
const RegistryDrawer = createDrawerNavigator();
const ProfileDrawer = createDrawerNavigator();
const DetailsDrawer = createDrawerNavigator();

const ContactStack = createNativeStackNavigator();
const ContentStack = createNativeStackNavigator();

export function Session() {
  const {state} = useSession();
  const scheme = useColorScheme();
  const [tab, setTab] = useState('content');
  const [textCard, setTextCard] = useState({ cardId: null} as {cardId: null|string});
  const [dismissed, setDismissed] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [showDisconnected, setShowDisconnected] = useState(false);

  const sessionNav = {strings: state.strings};
  const showContent = {display: tab === 'content' ? 'flex' : 'none'};
  const showContact = {display: tab === 'contacts' ? 'flex' : 'none'};
  const showSettings = {display: tab === 'settings' ? 'flex' : 'none'};

  const textContact = (cardId: null|string) => {
    setTextCard({ cardId });
  }

  const dismiss = () => {
    setDismissed(true);
    setTimeout(() => {
      setDismissed(false);
    }, 60000);
  }

  const contentTab = () => {
    if (tab !== 'content') {
      setTab('content');
    }
  }

  useEffect(() => {
    if (state.appState && !state.sdkState) {
      setDisconnected(true);
      setShowDisconnected(false);
      setTimeout(() => {
        setShowDisconnected(true);
      }, 2000);
    } else {
      setDisconnected(false);
    }
  }, [state.appState, state.sdkState]);

  return (
    <View style={styles.session}>
      {state.layout !== 'large' && (
        <Surface elevation={3}>
          <SafeAreaView style={styles.full}>
            <View style={styles.screen}>
              <View
                style={{
                  ...styles.body,
                  ...showContent,
                }}>
                <ContentTab textCard={textCard} scheme={scheme} contentTab={contentTab} />
              </View>
              <View
                style={{
                  ...styles.body,
                  ...showContact,
                }}>
                <ContactTab textContact={textContact} scheme={scheme} />
              </View>
              <View
                style={{
                  ...styles.body,
                  ...showSettings,
                }}>
                <Surface elevation={0}>
                  <Settings showLogout={true} />
                </Surface>
              </View>
              <View style={styles.tabs}>
                {tab === 'content' && (
                  <IconButton
                    style={styles.activeTab}
                    mode="contained"
                    icon={'comment-multiple'}
                    size={28}
                    onPress={() => {
                      setTab('content');
                    }}
                  />
                )}
                {tab !== 'content' && (
                  <IconButton
                    style={styles.idleTab}
                    mode="contained"
                    icon={'comment-multiple-outline'}
                    size={28}
                    onPress={() => {
                      setTab('content');
                    }}
                  />
                )}
                {tab === 'contacts' && (
                  <IconButton
                    style={styles.activeTab}
                    mode="contained"
                    icon={'contacts'}
                    size={28}
                    onPress={() => {
                      setTab('contacts');
                    }}
                  />
                )}
                {tab !== 'contacts' && (
                  <IconButton
                    style={styles.idleTab}
                    mode="contained"
                    icon={'contacts-outline'}
                    size={28}
                    onPress={() => {
                      setTab('contacts');
                    }}
                  />
                )}
                {tab === 'settings' && (
                  <IconButton
                    style={styles.activeTab}
                    mode="contained"
                    icon={'cog'}
                    size={28}
                    onPress={() => {
                      setTab('settings');
                    }}
                  />
                )}
                {tab !== 'settings' && (
                  <IconButton
                    style={styles.idleTab}
                    mode="contained"
                    icon={'cog-outline'}
                    size={28}
                    onPress={() => {
                      setTab('settings');
                    }}
                  />
                )}
              </View>
            </View>
          </SafeAreaView>
        </Surface>
      )}
      {state.layout === 'large' && (
        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View style={styles.container}>
            <DetailsScreen nav={sessionNav} />
          </View>
        </NavigationContainer>
      )}
      { disconnected && showDisconnected && !dismissed && (
        <View style={styles.alert}>
          <Surface elevation={5} style={styles.alertArea}>
            <Icon color={Colors.offsync} size={20} source="alert-circle-outline" />
            <Text style={styles.alertLabel}>{ state.strings.disconnected }</Text>
            <Pressable onPress={dismiss}>
              <Icon color={Colors.offsync} size={20} source="close" />
            </Pressable>
          </Surface>
        </View>
      )}
      <Calling />
    </View>
  );
}

function ContentTab({scheme, textCard, contentTab}: {scheme: string, textCard: {cardId: null|string}, contentTab: ()=>void}) {
  const openConversation = (props) => {
    props.navigation.navigate('conversation');
    contentTab();
  }

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ContentStack.Navigator initialRouteName="contacts" screenOptions={{headerShown: false}}>
        <ContentStack.Screen name="content" options={{headerBackTitleVisible: false}}>
          {props => (
            <Content textCard={textCard} openConversation={()=>openConversation(props)} />
          )}
        </ContentStack.Screen>
        <ContentStack.Screen name="conversation" options={styles.noHeader}>
          {props => (
            <SafeAreaView style={styles.screen}>
              <Conversation openDetails={()=>props.navigation.navigate('details')} close={()=>props.navigation.goBack()} wide={false} />
            </SafeAreaView>
          )}
        </ContentStack.Screen>
        <ContentStack.Screen name="details" options={styles.noHeader}>
          {props => (
            <Details close={()=>props.navigation.goBack()} closeAll={()=>props.navigation.popToTop()} />
          )}
        </ContentStack.Screen>
      </ContentStack.Navigator>
    </NavigationContainer>
  );
}

function ContactTab({scheme, textContact}: {scheme: string, textContact: (cardId: null|string)=>void}) {
  const [contactParams, setContactParams] = useState({
    guid: '',
  } as ContactParams);

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ContactStack.Navigator initialRouteName="contacts" screenOptions={{headerShown: false}}>
        <ContactStack.Screen name="contacts" options={{headerBackTitleVisible: false}}>
          {props => (
            <Contacts
              openRegistry={() => {
                props.navigation.navigate('registry');
              }}
              openContact={(params: ContactParams) => {
                setContactParams(params);
                props.navigation.navigate('profile');
              }}
              callContact={(cardId: string)=>console.log("CALL: ", cardId)}
              textContact={textContact}
            />
          )}
        </ContactStack.Screen>
        <ContactStack.Screen name="registry" options={styles.noHeader}>
          {props => (
            <Registry
              close={props.navigation.goBack}
              openContact={(params: ContactParams) => {
                setContactParams(params);
                props.navigation.navigate('profile');
              }}
            />
          )}
        </ContactStack.Screen>
        <ContactStack.Screen name="profile" options={styles.noHeader}>
          {props => <Profile close={props.navigation.goBack} params={contactParams} />}
        </ContactStack.Screen>
      </ContactStack.Navigator>
    </NavigationContainer>
  );
}

function DetailsScreen({nav}) {
  const [focus, setFocus] = useState(false);

  const closeAll = (props) => {
    props.navigation.closeDrawer();
    setFocus(false);
  }

  const DetailsComponent = useCallback(
    (props) => (
      <Surface elevation={3}>
        <Details
          closeAll={()=>closeAll(props)}
        />
      </Surface>
    ),
    [nav],
  );

  return (
    <DetailsDrawer.Navigator
      id="DetailsDrawer"
      drawerContent={DetailsComponent}
      screenOptions={{
        drawerPosition: 'right',
        drawerType: 'front',
        headerShown: false,
        overlayColor: 'rgba(8,8,8,.9)',
      }}>
      <DetailsDrawer.Screen name="details">{({navigation}) => <ProfileScreen nav={{...nav, focus, setFocus, details: navigation}} />}</DetailsDrawer.Screen>
    </DetailsDrawer.Navigator>
  );
}

function ProfileScreen({nav}) {
  const [contactParams, setContactParams] = useState({
    guid: '',
  } as ContactParams);
  const openContact = (params: ContactParams, open: () => {}) => {
    setContactParams(params);
    open();
  };

  const ProfileComponent = useCallback(() => (
    <Surface elevation={3}>
      <Profile params={contactParams} />
    </Surface>
  ), [contactParams]);

  return (
    <ProfileDrawer.Navigator
      id="ProfileDrawer"
      drawerContent={ProfileComponent}
      screenOptions={{
        drawerStyle: {width: 300},
        drawerPosition: 'right',
        drawerType: 'front',
        headerShown: false,
        overlayColor: 'rgba(8,8,8,.9)',
      }}>
      <ProfileDrawer.Screen name="registry">{({navigation}) => <RegistryScreen nav={{...nav, profile: navigation, openContact}} />}</ProfileDrawer.Screen>
    </ProfileDrawer.Navigator>
  );
}

function RegistryScreen({nav}) {
  const RegistryComponent = useCallback(
    () => (
      <Surface elevation={3}>
        <Registry
          openContact={(params: ContactParams) => {
            nav.openContact(params, nav.profile.openDrawer);
          }}
        />
      </Surface>
    ),
    [nav],
  );

  return (
    <RegistryDrawer.Navigator
      id="RegistryDrawer"
      drawerContent={RegistryComponent}
      screenOptions={{
        drawerStyle: {width: 350},
        drawerPosition: 'right',
        drawerType: 'front',
        headerShown: false,
        overlayColor: 'rgba(8,8,8,.9)',
      }}>
      <RegistryDrawer.Screen name="contacts">{({navigation}) => <ContactsScreen nav={{...nav, registry: navigation}} />}</RegistryDrawer.Screen>
    </RegistryDrawer.Navigator>
  );
}

function ContactsScreen({nav}) {
  const [textCard, setTextCard] = useState({ cardId: null} as {cardId: null|string});
  const ContactsComponent = useCallback(
    () => (
      <Surface elevation={3}>
        <Contacts
          openRegistry={nav.registry.openDrawer}
          openContact={(params: ContactParams) => {
            nav.openContact(params, nav.profile.openDrawer);
          }}
          callContact={(cardId: string)=>console.log('CALL: ', cardId)}
          textContact={(cardId: null|string)=>setTextCard({ cardId })}
        />
      </Surface>
    ),
    [nav],
  );

  return (
    <ContactsDrawer.Navigator
      id="ContactsDrawer"
      drawerContent={ContactsComponent}
      screenOptions={{
        drawerStyle: {width: 400},
        drawerPosition: 'right',
        drawerType: 'front',
        headerShown: false,
        overlayColor: 'rgba(8,8,8,.9)',
      }}>
      <ContactsDrawer.Screen name="settings">{({navigation}) => (
          <SettingsScreen nav={{...nav, textCard, contacts: navigation}} />
      )}</ContactsDrawer.Screen>
    </ContactsDrawer.Navigator>
  );
}

function SettingsScreen({nav}) {
  const SettingsComponent = useCallback(
    () => (
      <Surface elevation={3}>
        <SafeAreaView>
          <Settings />
        </SafeAreaView>
      </Surface>
    ),
    [],
  );

  return (
    <SettingsDrawer.Navigator
      id="SettingsDrawer"
      drawerContent={SettingsComponent}
      screenOptions={{
        drawerStyle: {width: '50%'},
        drawerPosition: 'right',
        drawerType: 'front',
        headerShown: false,
        overlayColor: 'rgba(8,8,8,.9)',
      }}>
      <SettingsDrawer.Screen name="home">{({navigation}) => <HomeScreen nav={{...nav, settings: navigation}} />}</SettingsDrawer.Screen>
    </SettingsDrawer.Navigator>
  );
}

function HomeScreen({nav}) {
  const [textCard, setTextCard] = useState({ cardId: null} as {cardId: null|string});

  return (
    <View style={styles.frame}>
      <View style={styles.left}>
        <Surface style={styles.identity} elevation={2} mode="flat">
          <Identity openSettings={nav.settings.openDrawer} openContacts={nav.contacts.openDrawer} />
        </Surface>
        <Surface style={styles.channels} elevation={2} mode="flat">
          <Content textCard={nav.textCard} openConversation={()=>nav.setFocus(true)} />
        </Surface>
      </View>
      <Surface elevation={1} style={styles.right} mode="flat">
        <SafeAreaView style={styles.right}>
          {nav.focus && <Conversation openDetails={nav.details.openDrawer} close={()=>nav.setFocus(false)} wide={true} />}
          {!nav.focus && <Text>FOCUS NOT SET</Text>}
        </SafeAreaView>
      </Surface>
    </View>
  );
}
