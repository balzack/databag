import React, {useCallback} from 'react';
import {SafeAreaView, View, useColorScheme} from 'react-native';
import {styles} from './Service.styled';
import {Surface} from 'react-native-paper';
import {Accounts} from '../accounts/Accounts';
import {Setup} from '../setup/Setup';
import {useService} from './useService.hook';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';

const SetupDrawer = createDrawerNavigator();

export function ServiceLarge() {
  const {state} = useService();
  const scheme = useColorScheme();

  return (
    <Surface elevation={0} style={styles.service}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={styles.container}>
          <SetupScreen />
        </View>
      </NavigationContainer>
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
