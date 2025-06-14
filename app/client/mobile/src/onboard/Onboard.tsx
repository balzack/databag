import React from 'react';
import {View, Image, useColorScheme} from 'react-native';
import {styles} from './Onboard.styled';
import {useOnboard} from './useOnboard.hook';
import {Text} from 'react-native-paper';
import {Welcome} from '../welcome/Welcome';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const OnboardStack = createNativeStackNavigator();

export function Onboard() {
  const {state, actions} = useOnboard();
  const scheme = useColorScheme();

  console.log('SHOW?', state.show);

  return (
    <View style={state.show ? styles.show : styles.hide}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <OnboardStack.Navigator initialRouteName="welcome" screenOptions={{headerShown: false}}>
          <OnboardStack.Screen name="welcome" options={{headerBackTitleVisible: false}}>
            {props => <View style={{top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'green', position: 'absolute'}} />}
          </OnboardStack.Screen>
        </OnboardStack.Navigator>
      </NavigationContainer>
    </View>
  );
}
