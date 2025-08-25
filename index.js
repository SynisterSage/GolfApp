import 'react-native-gesture-handler';
import 'react-native-reanimated';

import {AppRegistry} from 'react-native';
import App from './App';           // keep pointing at App.tsx
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
