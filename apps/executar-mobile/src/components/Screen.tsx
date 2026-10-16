import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { syncInfo, useStore } from '@/lib/store';
import { tone, type, useTheme } from '@/lib/theme';
import { Icon } from './ui';

/** Scrolling page with the large title, the sync pill (tabs) or a back link (sub-screens). */
export function Screen({ title, sub, back, children, scroll = true }: { title?: string; sub?: string; back?: string; children: ReactNode; scroll?: boolean }) {
	const t = useTheme();
	const insets = useSafeAreaInsets();
	const { s } = useStore();
	const sy = syncInfo(s);
	const head = (
		<>
			{back ? (
				<Pressable accessibilityRole="link" onPress={() => router.back()} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', height: 44, marginLeft: -8 }}>
					<Icon name="caret-left" size={20} color={t.link} /><Text style={{ color: t.link, fontSize: 17 }}>{back}</Text>
				</Pressable>
			) : (
				<View style={{ alignItems: 'flex-end' }}>
					<Pressable accessibilityRole="button" accessibilityLabel={'Sincronização: ' + sy.label} onPress={() => router.push('/sync')}
						style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 30, paddingHorizontal: 12, borderRadius: 980, backgroundColor: t.surface }}>
						<View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: sy.dot === 'neutral' ? t.neutral400 : tone(t, sy.dot)[1] }} />
						<Text style={{ fontSize: 12, color: t.text }}>{sy.label}</Text>
					</Pressable>
				</View>
			)}
			{title && <Text accessibilityRole="header" style={[type.large, { color: t.text, marginTop: 4, marginBottom: sub ? 6 : 16 }]}>{title}</Text>}
			{sub && <Text style={[type.callout, { color: t.muted, marginBottom: 20 }]}>{sub}</Text>}
		</>
	);
	if (!scroll) return <View style={{ flex: 1, backgroundColor: t.bg, paddingTop: insets.top }}>{children}</View>;
	return (
		<ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ paddingTop: insets.top + 4, paddingHorizontal: 16, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
			{head}
			{children}
		</ScrollView>
	);
}

export function Toast() {
	const { s } = useStore();
	const t = useTheme();
	if (!s.toast) return null;
	return (
		<View pointerEvents="none" accessibilityLiveRegion="polite" style={{ position: 'absolute', bottom: 110, left: 0, right: 0, alignItems: 'center' }}>
			<Text style={{ backgroundColor: t.text, color: t.bg, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 980, overflow: 'hidden', fontSize: 14 }}>{s.toast}</Text>
		</View>
	);
}
