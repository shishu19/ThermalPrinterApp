/**
 * @format
 */
// eslint-disable-next-line no-undef
globalThis.RNFB_MODULAR_DEPRECATION_STRICT_MODE = true;
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-get-random-values';


AppRegistry.registerComponent(appName, () => App);
