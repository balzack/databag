/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';


ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.log('Caught a global error:', error);
  console.log('Is fatal:', isFatal);
});

AppRegistry.registerComponent(appName, () => App);
