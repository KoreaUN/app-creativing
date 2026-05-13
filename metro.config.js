const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// react-native 0.85의 VirtualView는 codegen이 파싱 못하는 Flow 타입 사용
// 빈 스텁으로 대체해서 번들링 오류 우회
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName.includes('virtualview/VirtualView') ||
    moduleName.includes('VirtualViewExperimentalNativeComponent')
  ) {
    return {
      filePath: path.resolve(__dirname, 'stubs/VirtualView.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
