import * as C from '@executar/core';
import { router } from 'expo-router';
import { useRef } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Field, Icon, Progress, Segmented } from '@/components/ui';
import { useStore } from '@/lib/store';
import { radius, type, useTheme } from '@/lib/theme';

interface Opt { key: string; t: string; s: string; on: boolean; onPress: () => void; ic?: string; color?: string }

export default function Wizard() {
	const t = useTheme();
	const insets = useSafeAreaInsets();
	const { s, a } = useStore();
	const sc = useRef<React.ComponentRef<typeof ScrollView>>(null);
	const st = C.STEPS[s.step], su = s.setup;
	const choose = <T extends string | number>(list: C.Choice<T>[], key: 'periodo' | 'energia' | 'lang'): Opt[] =>
		list.map(o => ({ key: String(o.id), t: o.t, s: o.s, on: su[key] === o.id, onPress: () => a.setSetup(x => ({ ...x, [key]: o.id })) }));
	const multi = (ids: string[], key: 'grupos' | 'rotinas', meta: (id: string) => Omit<Opt, 'key' | 'on' | 'onPress'>): Opt[] => ids.map(id => {
		const on = (su[key] as string[]).includes(id);
		return { key: id, ...meta(id), on, onPress: () => a.setSetup(x => {
			const arr = on ? (x[key] as string[]).filter(k => k !== id) : [...(x[key] as string[]), id];
			const nx = { ...x, [key]: arr } as C.Setup;
			if (key === 'grupos') nx.ents = x.ents.filter(e => arr.includes(e.grupo));
			return nx;
		}) };
	});
	let opts: Opt[] = [];
	if (st.id === 'periodo') opts = choose(C.PERIODOS, 'periodo');
	if (st.id === 'energia') opts = choose(C.ENERGIA, 'energia');
	if (st.id === 'lang') opts = choose(C.LANGS, 'lang');
	if (st.id === 'grupos') opts = multi(C.GKEYS, 'grupos', g => { const G = C.GROUPS[g as C.GroupKey]; return { t: G.nome, s: G.desc, ic: G.ic, color: G.hex }; });
	if (st.id === 'rotinas') opts = multi(C.ROT_KEYS, 'rotinas', k => { const R = C.ROT[k as C.RoutineKey]; return { t: R.n.p, s: R.w + ' · ' + R.d.p }; });
	const addEnt = (g: C.GroupKey) => {
		const v = (drafts.current[g] || '').trim(); if (!v) return;
		drafts.current[g] = ''; inputs.current[g]?.clear();
		a.setSetup(x => x.ents.some(e => e.grupo === g && e.titulo.toLowerCase() === v.toLowerCase()) ? x : { ...x, ents: [...x.ents, { id: C.uid(), titulo: v, grupo: g, hz: null }] });
	};
	const drafts = useRef<Record<string, string>>({});
	const inputs = useRef<Record<string, React.ComponentRef<typeof TextInput> | null>>({});
	const last = s.step === C.STEPS.length - 1;
	const next = () => { if (a.next()) router.replace('/(tabs)'); else sc.current?.scrollTo({ y: 0, animated: false }); };

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: t.bg, paddingTop: insets.top }}>
			<View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 4 }}>
				<Pressable accessibilityRole="button" accessibilityLabel="Voltar" disabled={!s.step} onPress={() => a.up({ step: s.step - 1, err: '' })} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', opacity: s.step ? 1 : 0.3 }}><Icon name="caret-left" size={22} color={t.link} /></Pressable>
				<Text style={[type.caption, { flex: 1, textAlign: 'center', color: t.muted }]}>Pergunta {s.step + 1} de {C.STEPS.length}</Text>
				<Pressable accessibilityRole="button" onPress={() => router.replace('/(tabs)')} disabled={!s.plan} style={{ minWidth: 44, height: 44, justifyContent: 'center', opacity: s.plan ? 1 : 0 }}><Text style={{ color: t.link, fontSize: 17 }}>Fechar</Text></Pressable>
			</View>
			<View style={{ marginHorizontal: 20, marginTop: 6 }}><Progress pct={(s.step + 1) / C.STEPS.length * 100} /></View>
			<ScrollView ref={sc} style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingTop: 24 }} keyboardShouldPersistTaps="handled">
				<Text accessibilityRole="header" style={[type.title, { color: t.text, marginBottom: 8 }]}>{st.q}</Text>
				<Text style={[type.body, { color: t.muted, marginBottom: 24 }]}>{st.h}</Text>
				{st.id === 'nome' && <Field label="Nome do plano" placeholder="Ex.: Lançamento do blog" maxLength={60} value={su.nome} autoFocus onChangeText={v => a.setSetup(x => ({ ...x, nome: v }))} onSubmitEditing={next} returnKeyType="next" />}
				{opts.length > 0 && (
					<View style={{ gap: 8 }}>
						{opts.map(o => (
							<Pressable key={o.key} accessibilityRole={st.id === 'grupos' || st.id === 'rotinas' ? 'checkbox' : 'radio'} accessibilityState={{ checked: o.on }} onPress={o.onPress}
								style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 64, paddingHorizontal: 16, paddingVertical: 12, borderRadius: radius.md, backgroundColor: t.surface, borderWidth: 2, borderColor: o.on ? t.accent : 'transparent' }}>
								{o.ic && (
									<View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }}>
										<Icon name={o.ic} size={17} />
										<View style={{ position: 'absolute', right: -2, bottom: -2, width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: t.surface, backgroundColor: o.color }} />
									</View>
								)}
								<View style={{ flex: 1 }}><Text style={[type.headline, { color: t.text }]}>{o.t}</Text><Text style={[type.caption, { color: t.muted, marginTop: 2 }]}>{o.s}</Text></View>
								<Icon name={o.on ? 'check-circle' : 'circle'} size={22} color={o.on ? t.accent : t.neutral300} />
							</Pressable>
						))}
					</View>
				)}
				{st.id === 'ents' && (
					<View style={{ gap: 12 }}>
						{su.grupos.map(g => {
							const list = C.SUG[g].slice();
							su.ents.filter(e => e.grupo === g && !list.includes(e.titulo)).forEach(e => list.push(e.titulo));
							return (
								<View key={g} style={{ backgroundColor: t.surface, borderRadius: radius.lg, padding: 16 }}>
									<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.GROUPS[g].hex }} /><Text style={{ fontSize: 14, fontWeight: '600', color: t.text }}>{C.GROUPS[g].nome}</Text></View>
									<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
										{list.map(v => {
											const on = su.ents.some(e => e.grupo === g && e.titulo === v);
											return (
												<Pressable key={v} accessibilityRole="checkbox" accessibilityState={{ checked: on }} style={{ minHeight: 36, paddingHorizontal: 14, justifyContent: 'center', borderRadius: 980, borderWidth: 1, borderColor: t.divider, backgroundColor: on ? t.text : t.bg }}
													onPress={() => a.setSetup(x => ({ ...x, ents: on ? x.ents.filter(e => !(e.grupo === g && e.titulo === v)) : [...x.ents, { id: C.uid(), titulo: v, grupo: g, hz: null }] }))}>
													<Text style={{ fontSize: 14, color: on ? t.bg : t.text }}>{v}</Text>
												</Pressable>
											);
										})}
									</View>
									<View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
										<TextInput ref={r => { inputs.current[g] = r; }} onChangeText={v => { drafts.current[g] = v; }} onSubmitEditing={() => addEnt(g)} placeholder="Outro entregável…" placeholderTextColor={t.muted} maxLength={70} accessibilityLabel="Novo entregável"
											style={{ flex: 1, height: 40, borderRadius: radius.md, borderWidth: 1, borderColor: t.divider, backgroundColor: t.bg, color: t.text, paddingHorizontal: 12, fontSize: 15 }} />
										<Pressable accessibilityRole="button" accessibilityLabel="Adicionar" onPress={() => addEnt(g)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: t.accent, alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={18} color="#fff" /></Pressable>
									</View>
								</View>
							);
						})}
					</View>
				)}
				{st.id === 'dist' && (
					<View style={{ gap: 8 }}>
						<Button variant="ghost" size="sm" onPress={() => a.setSetup(x => ({ ...x, ents: C.autoAssign(x.ents, true) }))}>Distribuir automaticamente</Button>
						{su.ents.map(e => (
							<View key={e.id} style={{ backgroundColor: t.surface, borderRadius: radius.lg, paddingHorizontal: 16, paddingVertical: 14, gap: 10 }}>
								<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.GROUPS[e.grupo].hex }} /><Text style={[type.headline, { color: t.text }]}>{e.titulo}</Text></View>
								<Segmented label="Horizonte" value={String(e.hz ?? 0)} options={C.HZ.map((h, i) => ({ value: String(i), label: h.nome }))}
									onChange={v => a.setSetup(x => ({ ...x, ents: x.ents.map(y => y.id === e.id ? { ...y, hz: Number(v) as C.Hz } : y) }))} />
							</View>
						))}
					</View>
				)}
				{!!s.err && <View accessibilityRole="alert" style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 }}><Icon name="warning" size={16} color={t.danger} /><Text style={[type.caption, { color: t.danger }]}>{s.err}</Text></View>}
			</ScrollView>
			<View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 12, borderTopWidth: 1, borderTopColor: t.divider }}>
				<Button block onPress={next}>{last ? 'Gerar meu Prisma' : 'Continuar'}</Button>
			</View>
		</KeyboardAvoidingView>
	);
}
