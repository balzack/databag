import React, {useState, useCallback} from 'react';
import {SafeAreaView, View, useColorScheme} from 'react-native';
import {styles} from './Service.styled';
import {useTheme, IconButton, Surface} from 'react-native-paper';
import {Accounts} from '../accounts/Accounts';
import {Setup} from '../setup/Setup';
import {useService} from './useService.hook';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {BlurView} from '@react-native-community/blur';

const SetupDrawer = createDrawerNavigator();

export function Service() {
  const {state} = useService();
  const [tab, setTab] = useState('setup');
  const scheme = useColorScheme();
  const showAccounts = {width: '100%', height: '100%', display: tab === 'accounts' ? 'flex' : 'none'};
  const showSetup = {width: '100%', height: '100%', display: tab === 'setup' ? 'flex' : 'none'};
  const theme = useTheme();

  return (
    <Surface elevation={0} style={styles.service}>
      {state.layout !== 'large' && (
        <View style={styles.full}>
          <View style={styles.screen}>
            <View style={showAccounts}>
              <Accounts />
            </View>
            <View style={showSetup}>
              <Setup />
            </View>
            <Surface style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: 'transparent' }} elevation={4}>
              <BlurView style={styles.blur} blurType="light" blurAmount={8} reducedTransparencyFallbackColor="dark" />
              <View style={{ backgroundColor: theme.colors.bar, height: 96 }}>
                <SafeAreaView style={{ width: '100%', display: 'flex', flexDirection: 'row' }} edges={['bottom']}>
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
                </SafeAreaView>
              </View>
            </Surface>
          </View>
        </View>
      )}
      {state.layout === 'large' && (
        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View style={styles.container}>
            <SetupScreen />
          </View>
        </NavigationContainer>
      )}
    </Surface>
  );
}

function SetupScreen() {
  const SetupComponent = useCallback(
    () => (
      <Surface elevation={3} mode="flat">
        <Setup />
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
        overlayColor: 'rgba(0,0,0,.7)',
      }}>
      <SetupDrawer.Screen name="home">{({navigation}) => <AccountScreen setup={navigation} />}</SetupDrawer.Screen>
    </SetupDrawer.Navigator>
  );
}

function AccountScreen({setup}) {
  return (
    <SafeAreaView style={styles.frame}>
      <Accounts setup={setup.openDrawer} />
    </SafeAreaView>
  );
}
