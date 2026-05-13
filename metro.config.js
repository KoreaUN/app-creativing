const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// react-native 0.85의 VirtualViewExperimentalNativeComponent가
// 구버전 codegen과 충돌하므로 번들에서 제외
config.resolver.blockList = [
  /node_modules[/\\]react-native[/\\]src[/\\]private[/\\]components[/\\]virtualview[/\\].*/,
];

module.exports = config;
