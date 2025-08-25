// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // any other plugins you use go here...
    'react-native-worklets/plugin', // <-- must be the last plugin
  ],
};
