import { Tabs } from 'expo-router';
import { Icon } from '@/components/ui';
import { useTheme } from '@/lib/theme';

const TABS: [string, string, string][] = [['index', 'Prisma', 'list-checks'], ['executar', 'Executar', 'play-circle'], ['mapa', 'Mapa', 'tree-structure'], ['rotinas', 'Rotinas', 'sun-horizon'], ['conta', 'Conta', 'user-circle']];

export default function TabsLayout() {
	const t = useTheme();
	return (
		<Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: t.accent, tabBarInactiveTintColor: t.muted, tabBarStyle: { backgroundColor: t.bg, borderTopColor: t.divider }, tabBarLabelStyle: { fontSize: 11 } }}>
			{TABS.map(([name, title, icon]) => (
				<Tabs.Screen key={name} name={name} options={{ title, tabBarIcon: ({ color }) => <Icon name={icon} size={24} color={color} /> }} />
			))}
		</Tabs>
	);
}
