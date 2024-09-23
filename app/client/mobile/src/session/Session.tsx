import React, {useState, useContext} from 'react';
import {View, useColorScheme} from 'react-native';
import {styles} from './Session.styled';
import {BottomNavigation, Surface, Menu, Button, Text} from 'react-native-paper';
import {Settings} from '../settings/Settings';
import {Channels} from '../channels/Channels';
import {Contacts} from '../contacts/Contacts';
import {Registry} from '../registry/Registry';
import {Profile} from '../profile/Profile';
import {Details} from '../details/Details';
import {Identity} from '../identity/Identity';
import {useSession} from './useSession.hook';

import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';

const ChannelsRoute = () => <Channels />;
const ContactsRoute = () => <Contacts />;
const SettingsRoute = () => <Settings showLogout={true} />;

const SettingsDrawer = createDrawerNavigator();
const ContactsDrawer = createDrawerNavigator();
const RegistryDrawer = createDrawerNavigator();
const ProfileDrawer = createDrawerNavigator();
const DetailsDrawer = createDrawerNavigator();

export function Session() {
  const {state, actions} = useSession();
  const scheme = useColorScheme();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'channels',
      title: 'Channels',
      focusedIcon: 'comment-multiple',
      unfocusedIcon: 'comment-multiple-outline',
    },
    {
      key: 'contacts',
      title: 'Contacts',
      focusedIcon: 'contacts',
      unfocusedIcon: 'contacts-outline',
    },
    {
      key: 'settings',
      title: 'Settings',
      focusedIcon: 'cog',
      unfocusedIcon: 'cog-outline',
    },
  ]);
  const sessionNav = {strings: state.strings};

  const renderScene = BottomNavigation.SceneMap({
    channels: ChannelsRoute,
    contacts: ContactsRoute,
    settings: SettingsRoute,
  });

  return (
    <View style={styles.screen}>
      {state.layout !== 'large' && (
        <BottomNavigation
          labeled={false}
          navigationState={{index, routes}}
          onIndexChange={setIndex}
          renderScene={renderScene}
        />
      )}
      {state.layout === 'large' && (
        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <DetailsScreen nav={sessionNav} />
        </NavigationContainer>
      )}
    </View>
  );
}

function DetailsScreen({nav}) {
  return (
    <ProfileDrawer.Navigator
      id="ProfileDrawer"
      drawerContent={Details}
      screenOptions={{
        drawerPosition: 'right',
        drawerType: 'front',
        headerShown: false,
      }}>
      <ProfileDrawer.Screen name="profile">
        {({navigation}) => (
          <ProfileScreen nav={{...nav, details: navigation}} />
        )}
      </ProfileDrawer.Screen>
    </ProfileDrawer.Navigator>
  );
}

function ProfileScreen({nav}) {
  return (
    <ProfileDrawer.Navigator
      id="ProfileDrawer"
      drawerContent={Profile}
      screenOptions={{
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
      drawerContent={Registry}
      screenOptions={{
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
      drawerContent={Contacts}
      screenOptions={{
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
      drawerContent={Settings}
      screenOptions={{
        drawerStyle: { width: '40%' },
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
  const [menu, setMenu] = useState(false);

  return (
    <View style={styles.frame}>
      <View style={styles.left}>
        <Surface elevation={2} mode="flat">
          <Identity openSettings={nav.settings.openDrawer} />
        </Surface>
        <Surface style={styles.channels} elevation={1} mode="flat">
        </Surface>
      </View>
      <View style={styles.right}>
        <Text>CONVERSATION</Text>
      </View>
    </View>
  );
}
