import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toast } from '@/components/Screen';
import { StoreProvider } from '@/lib/store';
import { useTheme } from '@/lib/theme';

function Shell() {
	const t = useTheme();
	return (
		<View style={{ flex: 1, backgroundColor: t.bg }}>
			<StatusBar style="auto" />
			<Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg } }}>
				<Stack.Screen name="index" />
				<Stack.Screen name="login" />
				<Stack.Screen name="wizard" options={{ gestureEnabled: false }} />
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="exportar" options={{ presentation: 'fullScreenModal' }} />
			</Stack>
			<Toast />
		</View>
	);
}

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<StoreProvider>
				<Shell />
			</StoreProvider>
		</SafeAreaProvider>
	);
}
