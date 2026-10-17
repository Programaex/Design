// Four A4 templates filled with the plan — the same HTML as the web viewer (@executar/core/render), previewed in a
// WebView and printed natively (expo-print) at A4 (595 × 842 pt). "HTML" shares the self-contained file.
import * as C from '@executar/core';
import * as Print from 'expo-print';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Button, Icon, Segmented } from '@/components/ui';
import { shareText } from '@/lib/files';
import { useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

const A4 = { width: 595, height: 842 };

export default function Exportar() {
	const t = useTheme();
	const insets = useSafeAreaInsets();
	const { s, a } = useStore();
	const [content, setContent] = useState<'plan' | 'lorem'>('plan');
	const lorem = useMemo(() => C.loremPlan(), []);
	const plan = content === 'lorem' ? lorem : s.plan ?? C.demoPlan().plan;
	const tpl = s.exportTpl;
	const T = C.TEMPLATES.find(x => x.id === tpl)!;
	const doc = useMemo(() => C.documentHtml(tpl, plan), [tpl, plan]);
	const run = (fn: () => Promise<unknown>) => () => { fn().catch(() => a.say('Não foi possível concluir.')); };
	const pdf = run(async () => {
		const { uri } = await Print.printToFileAsync({ html: doc.html, ...A4 });
		await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: doc.title });
	});
	return (
		<View style={{ flex: 1, backgroundColor: '#F5F5F4', paddingTop: insets.top }}>
			<View style={{ backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#EAEAE8', paddingHorizontal: 12, paddingBottom: 10, gap: 8 }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
					<Pressable accessibilityRole="button" onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', height: 44, paddingRight: 8 }}><Icon name="caret-left" size={20} color="#2563EB" /><Text style={{ color: '#2563EB', fontSize: 16 }}>App</Text></Pressable>
					<View style={{ flex: 1 }}>
						<Text style={{ fontSize: 15, fontWeight: '600', color: '#202124' }}>{T.t}</Text>
						<Text style={{ fontFamily: 'Menlo', fontSize: 10, color: '#6B7280' }}>A4 retrato · 3 faces de 92,33 mm · {doc.pages} {doc.pages === 1 ? 'página' : 'páginas'}</Text>
					</View>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
					{C.TEMPLATES.map(x => {
						const on = x.id === tpl;
						return (
							<Pressable key={x.id} accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={() => a.up({ exportTpl: x.id })}
								style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 12, borderRadius: 40, borderWidth: 1, borderColor: on ? '#202124' : '#D1D5DB', backgroundColor: on ? '#202124' : '#FFFFFF' }}>
								<Icon name={x.icon} size={14} color={on ? '#fff' : '#202124'} /><Text style={{ fontSize: 13, color: on ? '#fff' : '#202124' }}>{x.t}</Text>
							</Pressable>
						);
					})}
				</ScrollView>
				<Segmented label="Conteúdo" value={content} onChange={setContent} options={[{ value: 'plan', label: 'Meu plano' }, { value: 'lorem', label: 'Lorem ipsum' }]} />
				<View style={{ flexDirection: 'row', gap: 8 }}>
					<Button size="sm" style={{ flex: 1 }} block onPress={run(() => Print.printAsync({ html: doc.html, ...A4 }))}>Imprimir</Button>
					<Button size="sm" style={{ flex: 1 }} block variant="secondary" onPress={pdf}>PDF</Button>
					<Button size="sm" style={{ flex: 1 }} block variant="secondary" onPress={run(() => shareText(doc.filename, doc.html, 'text/html'))}>HTML</Button>
				</View>
			</View>
			<WebView originWhitelist={['*']} source={{ html: doc.html }} style={{ flex: 1, backgroundColor: t.surface }} javaScriptEnabled setSupportMultipleWindows={false}
				onShouldStartLoadWithRequest={r => r.url === 'about:blank' || r.url.startsWith('data:') || r.url.startsWith('https://fonts.')} />
		</View>
	);
}
