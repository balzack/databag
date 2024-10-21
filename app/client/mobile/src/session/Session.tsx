import React, {useState} from 'react';
import {SafeAreaView, View, useColorScheme} from 'react-native';
import {styles} from './Session.styled';
import {BottomNavigation, Surface, Text} from 'react-native-paper';
import {Settings} from '../settings/Settings';
import {Channels} from '../channels/Channels';
import {Contacts} from '../contacts/Contacts';
import {Registry} from '../registry/Registry';
import {Profile, ContactParams} from '../profile/Profile';
import {Details} from '../details/Details';
import {Identity} from '../identity/Identity';
import {useSession} from './useSession.hook';

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
const TopicStack = createStackNavigator();

export function Session() {
  const {state} = useSession();
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

  const ChannelsRoute = () => <Channels />;
  const ContactsRoute = () => <ContactTab />;
  const SettingsRoute = () => <Settings showLogout={true} />;

  const renderScene = BottomNavigation.SceneMap({
    channels: ChannelsRoute,
    contacts: ContactsRoute,
    settings: SettingsRoute,
  });

  return (
    <View style={styles.screen}>
      {state.layout !== 'large' && (
        <Surface elevation={2}>
          <SafeAreaView style={{ width: '100%', height: '100%' }}>
            <NavigationContainer
                theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
              <BottomNavigation
                barStyle={{ height: 64 }}
                labeled={false}
                navigationState={{index, routes}}
                onIndexChange={setIndex}
                renderScene={renderScene}
              />
            </NavigationContainer>
          </SafeAreaView>
        </Surface>
      )}
      {state.layout === 'large' && (
        <NavigationContainer
          theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <DetailsScreen nav={sessionNav} />
        </NavigationContainer>
      )}
    </View>
  );
}

function ContactTab() {
  return (
    <ContactStack.Navigator initialRouteName="contacts" screenOptions={{ headerShown: false }}>
      <ContactStack.Screen name="contacts" options={{ headerBackTitleVisible: false }}>
        {(props) => <Contacts openRegistry={()=>{console.log('openreg')}} openContact={(params: ContactParams)=>{console.log('opencon', params)}} />}
      </ContactStack.Screen>
    </ContactStack.Navigator>
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
      drawerContent={() => <Contacts onRegistry={()=>{console.log('openreg')}} openContact={(params: ContactParams)=>{console.log('opencon', params)}} />}
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
        drawerStyle: {width: '40%'},
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
          <Identity openSettings={nav.settings.openDrawer} />
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
