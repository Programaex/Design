// Expo configures Metro for npm workspaces automatically (SDK 52+). The one addition: the monorepo root also holds
// React 19.2 for the web apps, so react / react-native are pinned to this app's copies to guarantee a single React.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
const pinned = ['react', 'react-native', 'react-dom'];
const upstream = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
	const root = pinned.find(p => moduleName === p || moduleName.startsWith(p + '/'));
	const ctx = root ? { ...context, originModulePath: path.join(__dirname, 'package.json') } : context;
	return upstream ? upstream(ctx, moduleName, platform) : context.resolveRequest(ctx, moduleName, platform);
};
module.exports = config;
