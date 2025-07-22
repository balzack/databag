/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';


ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.log('Caught a global error:', error);
  console.log('Is fatal:', isFatal);
});

messaging().registerDeviceForRemoteMessages().then(() => { });

messaging().setBackgroundMessageHandler(async remoteMessage => {});

AppRegistry.registerComponent(appName, () => App);
