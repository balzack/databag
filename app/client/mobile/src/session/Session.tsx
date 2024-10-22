import React, {useState} from 'react';
import {SafeAreaView, View, useColorScheme} from 'react-native';
import {styles} from './Session.styled';
import {IconButton, Surface, Text} from 'react-native-paper';
import {Settings} from '../settings/Settings';
import {Channels} from '../channels/Channels';
import {Contacts} from '../contacts/Contacts';
import {Registry} from '../registry/Registry';
import {Profile, ContactParams} from '../profile/Profile';
import {Details} from '../details/Details';
import {Identity} from '../identity/Identity';
import {useSession} from './useSession.hook';
import { TransitionPresets } from '@react-navigation/stack';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

const SettingsDrawer = createDrawerNavigator();
const ContactsDrawer = createDrawerNavigator();
const RegistryDrawer = createDrawerNavigator();
const ProfileDrawer = createDrawerNavigator();
const DetailsDrawer = createDrawerNavigator();

const ContactStack = createStackNavigator();
const ContentStack = createStackNavigator();

export function Session() {
  const {state} = useSession();
  const scheme = useColorScheme();
  const [tab, setTab] = useState('content');

  const sessionNav = {strings: state.strings};

  const ChannelsRoute = () => <Channels />;
  const ContactsRoute = () => <ContactTab />;
  const SettingsRoute = () => <Settings showLogout={true} />;

  return (
    <View style={styles.session}>
      {state.layout !== 'large' && (
        <Surface elevation={2}>
          <SafeAreaView style={{ width: '100%', height: '100%' }}>
            <View style={styles.screen}>
              <View style={{...styles.body, display: tab === 'content' ? 'flex' : 'none'}}>
                <ContentTab scheme={scheme} />
              </View>
              <View style={{...styles.body, display: tab === 'contacts' ? 'flex' : 'none'}}>
                <ContactTab scheme={scheme} />
              </View>
              <View style={{...styles.body, display: tab === 'settings' ? 'flex' : 'none'}}>
                <Settings showLogout={true} />
              </View>
              <View style={styles.tabs}>
                { tab === 'content' && (
                  <IconButton style={styles.activeTab} mode="contained" icon={'comment-multiple'} size={28} onPress={()=>{setTab('content')}} />
                )}
                { tab !== 'content' && (
                  <IconButton style={styles.idleTab} mode="contained" icon={'comment-multiple-outline'} size={28} onPress={()=>{setTab('content')}} />
                )}
                { tab === 'contacts' && (
                  <IconButton style={styles.activeTab} mode="contained" icon={'contacts'} size={28} onPress={()=>{setTab('contacts')}} />
                )}
                { tab !== 'contacts' && (
                  <IconButton style={styles.idleTab} mode="contained" icon={'contacts-outline'} size={28} onPress={()=>{setTab('contacts')}} />
                )}
                { tab === 'settings' && (
                  <IconButton style={styles.activeTab} mode="contained" icon={'cog'} size={28} onPress={()=>{setTab('settings')}} />
                )}
                { tab !== 'settings' && (
                  <IconButton style={styles.idleTab} mode="contained" icon={'cog-outline'} size={28} onPress={()=>{setTab('settings')}} />
                )}
              </View>
            </View>
          </SafeAreaView>
        </Surface>
      )}
      {state.layout === 'large' && (
        <NavigationContainer
          theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View style={styles.container}>
            <DetailsScreen nav={sessionNav} />
          </View>
        </NavigationContainer>
      )}
    </View>
  );
}

function ContentTab({ scheme }: { scheme: string }) {
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ContactStack.Navigator initialRouteName="contacts" screenOptions={{ headerShown: false }}>
        <ContactStack.Screen name="content" options={{ headerBackTitleVisible: false }}>
          {(props) => <Text>CONTENT</Text>}
        </ContactStack.Screen>
      </ContactStack.Navigator>
    </NavigationContainer>
  );
}

function ContactTab({ scheme }: { scheme: string }) {
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ContactStack.Navigator initialRouteName="contacts" screenOptions={{ headerShown: false }}>
        <ContactStack.Screen name="contacts" options={{ headerBackTitleVisible: false }}>
          {(props) => <Contacts openRegistry={()=>{props.navigation.navigate('registry')}} openContact={(params: ContactParams)=>{props.navigation.navigate('profile')}} />}
        </ContactStack.Screen>
        <ContactStack.Screen name="registry" options={{ headerBackTitleVisible: false, ...TransitionPresets.ScaleFromCenterAndroid }}>
          {(props) => <Registry close={props.navigation.goBack} openContact={(params: ContactParams)=>{props.navigation.navigate('profile')}} />}
        </ContactStack.Screen>
        <ContactStack.Screen name="profile" options={{ headerBackTitleVisible: false, ...TransitionPresets.ScaleFromCenterAndroid }}>
          {(props) => <Profile close={props.navigation.goBack} />}
        </ContactStack.Screen>
      </ContactStack.Navigator>
    </NavigationContainer>
  );
}

function DetailsScreen({nav}) {
  return (
    <DetailsDrawer.Navigator
      id="DetailsDrawer"
      drawerContent={Details}
      screenOptions={{
        drawerPosition: 'right',
        drawerType: 'front',
        headerShown: false,
      }}>
      <DetailsDrawer.Screen name="details">
        {({navigation}) => (
          <ProfileScreen nav={{...nav, details: navigation}} />
        )}
      </DetailsDrawer.Screen>
    </DetailsDrawer.Navigator>
  );
}

function ProfileScreen({nav}) {
  return (
    <ProfileDrawer.Navigator
      id="ProfileDrawer"
      drawerContent={Profile}
      screenOptions={{
        drawerStyle: {width: 300},
        drawerPosition: 'right',
        drawerType: 'front',
        headerShown: false,
      }}>
      <ProfileDrawer.Screen name="registry">
        {({navigation}) => (
          <RegistryScreen nav={{...nav, profile: navigation}} />
        )}
      </ProfileDrawer.Screen>
    </ProfileDrawer.Navigator>
  );
}

function RegistryScreen({nav}) {
  return (
    <RegistryDrawer.Navigator
      id="RegistryDrawer"
      drawerContent={() => (
        <Surface elevation={1}>
          <Registry openContact={(params: ContactParams)=>{nav.profile.openDrawer()}} />
        </Surface>
      )}
      screenOptions={{
        drawerStyle: {width: 350},
        drawerPosition: 'right',
        drawerType: 'front',
        headerShown: false,
      }}>
      <RegistryDrawer.Screen name="contacts">
        {({navigation}) => (
          <ContactsScreen nav={{...nav, registry: navigation}} />
        )}
      </RegistryDrawer.Screen>
    </RegistryDrawer.Navigator>
  );
}

function ContactsScreen({nav}) {
  return (
    <ContactsDrawer.Navigator
      id="ContactsDrawer"
      drawerContent={() => (
        <Surface elevation={1}>
          <Contacts openRegistry={nav.registry.openDrawer} openContact={(params: ContactParams)=>{nav.profile.openDrawer()}} />
        </Surface>
      )}
      screenOptions={{
        drawerStyle: {width: 400},
        drawerPosition: 'right',
        drawerType: 'front',
        headerShown: false,
      }}>
      <ContactsDrawer.Screen name="settings">
        {({navigation}) => (
          <SettingsScreen nav={{...nav, contacts: navigation}} />
        )}
      </ContactsDrawer.Screen>
    </ContactsDrawer.Navigator>
  );
}

function SettingsScreen({nav}) {
  return (
    <SettingsDrawer.Navigator
      id="SettingsDrawer"
      drawerContent={() => (<Settings />)}
      screenOptions={{
        drawerStyle: {width: '50%'},
        drawerPosition: 'right',
        drawerType: 'front',
        headerShown: false,
      }}>
      <SettingsDrawer.Screen name="home">
        {({navigation}) => <HomeScreen nav={{...nav, settings: navigation}} />}
      </SettingsDrawer.Screen>
    </SettingsDrawer.Navigator>
  );
}

function HomeScreen({nav}) {
  return (
    <View style={styles.frame}>
      <View style={styles.left}>
        <Surface elevation={2} mode="flat">
          <Identity openSettings={nav.settings.openDrawer} openContacts={nav.contacts.openDrawer} />
        </Surface>
        <Surface style={styles.channels} elevation={1} mode="flat">
          <Text>CHANNELS</Text>
        </Surface>
      </View>
      <View style={styles.right}>
        <Text>CONVERSATION</Text>
      </View>
    </View>
  );
}
