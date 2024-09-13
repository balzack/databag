import { useState, useContext } from 'react';
import { View } from 'react-native';
import {styles} from './Session.styled';
import { BottomNavigation, Button, Text } from 'react-native-paper';
import { DisplayContext } from '../context/DisplayContext';
import { Settings } from '../settings/Settings';
import { Channels } from '../channels/Channels';
import { Contacts } from '../contacts/Contacts';

const ChannelsRoute = () => <Channels />;

const ContactsRoute = () => <Contacts />;

const SettingsRoute = () => <Settings />;

export function Session() {
  const display = useContext(DisplayContext);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'channels', title: 'Channels', focusedIcon: 'comment-multiple', unfocusedIcon: 'comment-multiple-outline' },
    { key: 'contacts', title: 'Contacts', focusedIcon: 'contacts', unfocusedIcon: 'contacts-outline' },
    { key: 'settings', title: 'Settings', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    channels: ChannelsRoute,
    contacts: ContactsRoute,
    settings: SettingsRoute,
  });

  console.log(display.state.layout);

  return (
    <View style={styles.screen}>
      {display.state.layout !== 'large' && (
        <BottomNavigation
          labeled={false}
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
        />
      )}
      {display.state.layout === 'large' && (
        <Text>LARGE</Text>
      )}
    </View>
  );
};

