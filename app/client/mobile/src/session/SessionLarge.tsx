import React, {useState, useCallback, useEffect} from 'react';
import {Pressable, View, useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RingContextProvider} from '../context/RingContext';
import {styles} from './Session.styled';
import {Surface, Text, Icon, useTheme} from 'react-native-paper';
import {Settings} from '../settings/Settings';
import {Contacts} from '../contacts/Contacts';
import {Content} from '../content/Content';
import {Registry} from '../registry/Registry';
import {Profile, ContactParams} from '../profile/Profile';
import {Details} from '../details/Details';
import {Identity} from '../identity/Identity';
import {Assemble} from '../assemble/Assemble';
import {Members} from '../members/Members';
import {Base} from '../base/Base';
import {Conversation} from '../conversation/Conversation';
import {useSession} from './useSession.hook';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Colors} from '../constants/Colors';
import {Ring} from '../ring/Ring';
import {Call} from '../call/Call';

const SettingsDrawer = createDrawerNavigator();
const ContactsDrawer = createDrawerNavigator();
const RegistryDrawer = createDrawerNavigator();
const ProfileDrawer = createDrawerNavigator();
const DetailsDrawer = createDrawerNavigator();
const MembersDrawer = createDrawerNavigator();

function MembersScreen({nav}) {
  const closeAll = props => {
    props.navigation.closeDrawer();
    nav.setFocus(false);
  };

  const MembersComponent = useCallback(
    props => (
      <Surface elevation={3} mode="flat">
        <Members layout="large" />
      </Surface>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nav],
  );

  return (
    <MembersDrawer.Navigator
      id="MembersDrawer"
      drawerContent={MembersComponent}
      screenOptions={{
        drawerStyle: {width: 400},
        drawerPosition: 'right',
        drawerType: 'front',
        headerShown: false,
        overlayColor: 'rgba(8,8,8,.9)',
      }}>
      <MembersDrawer.Screen name="details">{({navigation}) => <DetailsScreen nav={{...nav, members: navigation}} />}</MembersDrawer.Screen>
    </MembersDrawer.Navigator>
  );
}

function DetailsScreen({nav}) {
  const closeAll = props => {
    props.navigation.closeDrawer();
    nav.setFocus(false);
  };

  const DetailsComponent = useCallback(
    props => (
      <Surface elevation={3} mode="flat">
        <Details layout="large" closeAll={() => closeAll(props)} edit={nav.members.openDrawer} />
      </Surface>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nav],
  );

  return (
    <DetailsDrawer.Navigator
      id="DetailsDrawer"
      drawerContent={DetailsComponent}
      screenOptions={{
        drawerStyle: {width: 450},
        drawerPosition: 'right',
        drawerType: 'front',
        headerShown: false,
        overlayColor: 'rgba(8,8,8,.9)',
      }}>
      <DetailsDrawer.Screen name="details">{({navigation}) => <ProfileScreen nav={{...nav, details: navigation}} />}</DetailsDrawer.Screen>
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

  const ProfileComponent = useCallback(
    () => (
      <Surface elevation={3} mode="flat">
        <Profile layout="large" params={contactParams} />
      </Surface>
    ),
    [contactParams],
  );

  return (
    <ProfileDrawer.Navigator
      id="ProfileDrawer"
      drawerContent={ProfileComponent}
      screenOptions={{
        drawerStyle: {width: 400},
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
      <Surface elevation={1} mode="flat">
        <Surface elevation={3} mode="flat">
          <SafeAreaView edges={['top']}></SafeAreaView>
        </Surface>
        <Registry
          layout="large"
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
        drawerStyle: {width: 425},
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
  const ContactsComponent = useCallback(
    () => (
      <Surface elevation={1} mode="flat">
        <Surface elevation={3} mode="flat">
          <SafeAreaView edges={['top']}></SafeAreaView>
        </Surface>
        <Contacts
          layout="large"
          openRegistry={nav.registry.openDrawer}
          openContact={(params: ContactParams) => {
            nav.openContact(params, nav.profile.openDrawer);
          }}
          callContact={nav.callContact}
          textContact={nav.textContact}
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
        drawerStyle: {width: 450},
        drawerPosition: 'right',
        drawerType: 'front',
        headerShown: false,
        overlayColor: 'rgba(8,8,8,.9)',
      }}>
      <ContactsDrawer.Screen name="settings">{({navigation}) => <SettingsScreen nav={{...nav, contacts: navigation}} />}</ContactsDrawer.Screen>
    </ContactsDrawer.Navigator>
  );
}

function SettingsScreen({nav}) {
  const SettingsComponent = useCallback(
    () => (
      <Surface elevation={2} mode="flat">
        <Settings layout="large" />
      </Surface>
    ),
    [],
  );

  return (
    <SettingsDrawer.Navigator
      id="SettingsDrawer"
      drawerContent={SettingsComponent}
      screenOptions={{
        drawerStyle: {width: 450},
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
  const theme = useTheme();

  useEffect(() => {
    nav.contacts.closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav.callCard]);

  return (
    <View style={styles.frame}>
      <View style={styles.left}>
        <Surface style={{ ...styles.identity, borderColor: theme.colors.elevation.level0 }} elevation={1} mode="flat">
          <Identity openSettings={nav.settings.openDrawer} openContacts={nav.contacts.openDrawer} />
        </Surface>
        <Surface style={styles.channels} elevation={0} mode="flat">
          <Content share={nav.share} textCard={nav.textCard} closeAll={() => {}} layout="large" openConversation={() => { nav.setAssemble(false);  nav.setFocus(true)}} createConversation={() => { nav.setFocus(false); nav.setAssemble(true)}} />
        </Surface>
      </View>
      <Surface elevation={2} style={styles.right} mode="flat">
        {!nav.focus && !nav.assemble && <Base />}
        <SafeAreaView style={styles.right} edges={['top', 'bottom']}>
          <View style={styles.ring}>
            <Ring />
          </View>
          <View style={styles.workarea}>
            {nav.focus && (
              <View style={styles.focus}>
                <Conversation layout="large" openDetails={nav.details.openDrawer} close={() => nav.setFocus(false)} wide={true} />
              </View>
            )}
            {nav.assemble && (
              <View style={styles.focus}>
                <Assemble layout="large" close={() => nav.setAssemble(false)} openConversation={() => { nav.setAssemble(false); nav.setFocus(true)}} />
              </View>
            )}
          </View>
        </SafeAreaView>
      </Surface>
    </View>
  );
}

export function SessionLarge({share}: {share: {filePath: string; mimeType: string}}) {
  const {state} = useSession();
  const scheme = useColorScheme();
  const [tab, setTab] = useState('content');
  const [textCard, setTextCard] = useState({cardId: null} as {cardId: null | string});
  const [callCard, setCallCard] = useState({card: null} as {card: null | Card});
  const [dismissed, setDismissed] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [showDisconnected, setShowDisconnected] = useState(false);
  const [focus, setFocus] = useState(false);
  const [assemble, setAssemble] = useState(false);

  const textContact = (cardId: null | string) => {
    setTextCard({cardId});
  };

  const callContact = (card: null | Card) => {
    setCallCard({card});
  };

  const sessionNav = {strings: state.strings, callContact, callCard, textContact, textCard, focus, setFocus, assemble, setAssemble, share};

  const dismiss = () => {
    setDismissed(true);
    setTimeout(() => {
      setDismissed(false);
    }, 60000);
  };

  const contentTab = () => {
    if (tab !== 'content') {
      setTab('content');
    }
  };

  useEffect(() => {
    if (share) {
      contentTab();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [share]);

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
    <RingContextProvider>
      <View style={styles.session}>
        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View style={styles.container}>
            <MembersScreen nav={sessionNav} />
          </View>
        </NavigationContainer>
        {disconnected && showDisconnected && !dismissed && (
          <View style={styles.alert}>
            <Surface elevation={5} style={styles.alertArea}>
              <Icon color={Colors.offsync} size={20} source="alert-circle-outline" />
              <Text style={styles.alertLabel}>{state.strings.disconnected}</Text>
              <Pressable onPress={dismiss}>
                <Icon color={Colors.offsync} size={20} source="close" />
              </Pressable>
            </Surface>
          </View>
        )}
        <Call />
      </View>
    </RingContextProvider>
  );
}
