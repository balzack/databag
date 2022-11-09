import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';
import messaging from '@react-native-firebase/messaging';

messaging().registerDeviceForRemoteMessages().then(() => {});

messaging().setBackgroundMessageHandler(async remoteMessage => {});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
