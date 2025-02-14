import React, {useState, useCallback, useEffect} from 'react';
import {SafeAreaView, Pressable, View, useColorScheme} from 'react-native';
import {styles} from './Service.styled';
import {IconButton, Surface, Text, Icon} from 'react-native-paper';
import {Accounts} from '../accounts/Accounts';
import {Setup} from '../setup/Setup';
import {useService} from './useService.hook';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Colors} from '../constants/Colors';

const SetupDrawer = createDrawerNavigator();

export function Service() {
  const { state, actions } = useService();
  const [tab, setTab] = useState('accounts');
  const scheme = useColorScheme();
  const showAccounts = {display: tab === 'accounts' ? 'flex' : 'none'};
  const showSetup = {display: tab === 'setup' ? 'flex' : 'none'};

  return (
    <View style={styles.service}>
      {state.layout !== 'large' && (
        <Surface elevation={3}>
          <SafeAreaView style={styles.full}>
            <View style={styles.screen}>
              <View
                style={{
                  ...styles.body,
                  ...showAccounts,
                }}>
                <Accounts />
              </View>
              <View
                style={{
                  ...styles.body,
                  ...showSetup,
                }}>
                <Setup />
              </View>
              <View style={styles.tabs}>
                {tab === 'accounts' && (
                  <IconButton
                    style={styles.activeTab}
                    mode="contained"
                    icon={'contacts'}
                    size={28}
                    onPress={() => {
                      setTab('accounts');
                    }}
                  />
                )}
                {tab !== 'accounts' && (
                  <IconButton
                    style={styles.idleTab}
                    mode="contained"
                    icon={'contacts-outline'}
                    size={28}
                    onPress={() => {
                      setTab('accounts');
                    }}
                  />
                )}
                {tab === 'setup' && (
                  <IconButton
                    style={styles.activeTab}
                    mode="contained"
                    icon={'cog'}
                    size={28}
                    onPress={() => {
                      setTab('setup');
                    }}
                  />
                )}
                {tab !== 'setup' && (
                  <IconButton
                    style={styles.idleTab}
                    mode="contained"
                    icon={'cog-outline'}
                    size={28}
                    onPress={() => {
                      setTab('setup');
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
            <SetupScreen />
          </View>
        </NavigationContainer>
      )}
    </View>
  );
}

function SetupScreen() {
  const SetupComponent = useCallback(
    () => (
      <Surface elevation={3} mode="flat">
        <SafeAreaView>
          <Setup />
        </SafeAreaView>
      </Surface>
    ),
    [],
  );

  return (
    <SetupDrawer.Navigator
      id="SetupDrawer"
      drawerContent={SetupComponent}
      screenOptions={{
        drawerStyle: {width: '50%'},
        drawerPosition: 'right',
        drawerType: 'front',
        headerShown: false,
        overlayColor: 'rgba(8,8,8,.9)',
      }}>
      <SetupDrawer.Screen name="home">{({navigation}) => <AccountScreen setup={navigation} />}</SetupDrawer.Screen>
    </SetupDrawer.Navigator>
  );
}

function AccountScreen({setup}) {
  return (
    <View style={styles.frame}>
      <Accounts />
      <IconButton
        mode="contained"
        icon={'cog'}
        size={28}
        onPress={setup.openDrawer}
      />
    </View>
  );
}

