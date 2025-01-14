/**
 * @format
 */

import './gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

console.log("CALLING REGISTER DEVICE");

messaging().registerDeviceForRemoteMessages().then(() => { console.log("REGISTER SUCCESS!!!!"); });

messaging().setBackgroundMessageHandler(async remoteMessage => {});

AppRegistry.registerComponent(appName, () => App);
