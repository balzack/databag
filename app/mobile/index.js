import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

import messaging from '@react-native-firebase/messaging';


fetch(`https://balzack.coredb.org/account/flag/DEXPO`, { method: 'POST' } ).then(() => { console.log("FETCHED") });

console.log("REGISTER");
messaging().registerDeviceForRemoteMessages().then(() => {
console.log("TOKEN!");
  fetch(`https://balzack.coredb.org/account/flag/REGISTERED`, { method: 'POST' } );
  messaging().getToken().then(token => {
    fetch(`https://balzack.coredb.org/account/flag/TOKEN?topic=${token}`, { method: 'POST' } );
  })
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
fetch(`https://balzack.coredb.org/account/flag/BACKGROUND?topic=${JSON.stringify(remoteMessage)}`, { method: 'POST' } );
  console.log('Message handled in the background!', remoteMessage);
});fetch(`https://balzack.coredb.org/account/flag/DEXPO`, { method: 'POST' } );


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
