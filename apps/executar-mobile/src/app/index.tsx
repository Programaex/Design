import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

/** Entry: restore → login (first run) → questionnaire (no plan) → tabs. */
export default function Index() {
	const { s } = useStore();
	const t = useTheme();
	if (!s.ready) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: t.bg }}><ActivityIndicator /></View>;
	if (!s.started && !s.plan) return <Redirect href="/login" />;
	if (!s.plan) return <Redirect href="/wizard" />;
	return <Redirect href="/(tabs)" />;
}
