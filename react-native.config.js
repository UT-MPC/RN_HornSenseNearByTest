// react-native.config.js
module.exports = {
  dependencies: {
    '<dependency>': {
      platforms: {
        ios: null, // disable ios platform, other platforms will still autolink
      },
    },
  },
};