/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App'; // Make sure the path to your App.js is correct
import { name as appName } from './app.json'; // Ensure the app name is imported correctly

AppRegistry.registerComponent(appName, () => App);

