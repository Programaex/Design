import * as C from '@executar/core';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button, Icon, SectionLabel } from '@/components/ui';
import { pickText, shareText } from '@/lib/files';
import { useStore } from '@/lib/store';
import { radius, type, useTheme } from '@/lib/theme';

export default function Dados() {
	const t = useTheme();
	const { s, a } = useStore();
	const plan = s.plan;
	if (!plan) return null;
	const exportJson = async () => {
		try { await shareText('prisma-' + (C.slug(plan.nome) || 'plano') + '.json', JSON.stringify(C.exportPayload(plan, s.setup), null, 2), 'application/json'); }
		catch { a.say('Não foi possível exportar'); }
	};
	const importFile = async () => {
		try {
			const f = await pickText(); if (!f) return;
			a.importPlan(/\.csv$/i.test(f.name) ? C.planFromCsv(f.text, f.name.replace(/\.csv$/i, '')) : C.parseImport(f.text));
			router.replace('/(tabs)');
		} catch (e) { a.say(e instanceof Error && /Colunas|CSV/.test(e.message) ? e.message : 'Arquivo inválido'); }
	};
	const rows = [
		{ icon: 'file-arrow-down', label: 'Exportar arquivo', sub: 'Compartilha o plano em JSON.', onPress: exportJson },
		{ icon: 'file-arrow-up', label: 'Importar arquivo', sub: 'JSON do Prisma ou CSV do plano operacional.', onPress: importFile },
		{ icon: 'file-pdf', label: 'PDF do modelo escolhido', sub: 'Abre a visualização com Imprimir / PDF.', onPress: () => router.push('/exportar') }
	];
	return (
		<Screen title="Dados" back="Conta" sub="Escolha um modelo para o plano preenchido ou leve os dados para outro aparelho.">
			<SectionLabel>Modelos de exportação</SectionLabel>
			<View accessibilityRole="radiogroup" style={{ gap: 8, marginTop: -16 }}>
				{C.TEMPLATES.map(tp => {
					const on = s.exportTpl === tp.id;
					return (
						<Pressable key={tp.id} accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={() => a.up({ exportTpl: tp.id })}
							style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderRadius: radius.lg, backgroundColor: t.surface, borderWidth: 2, borderColor: on ? t.accent : 'transparent' }}>
							<View style={{ width: 38, height: 50, borderRadius: 6, backgroundColor: t.bg, borderWidth: 1, borderColor: t.divider, alignItems: 'center', justifyContent: 'center' }}><Icon name={tp.icon} size={18} color={t.muted} /></View>
							<View style={{ flex: 1 }}><Text style={[type.headline, { color: t.text }]}>{tp.t}</Text><Text style={{ fontSize: 13, color: t.muted, marginTop: 2 }}>{tp.s}</Text></View>
							<Icon name={on ? 'check-circle' : 'circle'} size={22} color={on ? t.accent : t.neutral300} />
						</Pressable>
					);
				})}
			</View>
			<View style={{ marginTop: 12, marginBottom: 4 }}><Button block onPress={() => router.push('/exportar')}>Visualizar e exportar</Button></View>
			<SectionLabel>Dados do plano</SectionLabel>
			<View style={{ gap: 8, marginTop: -16 }}>
				{rows.map(r => (
					<Pressable key={r.label} accessibilityRole="button" onPress={r.onPress} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.lg, backgroundColor: t.surface, opacity: pressed ? 0.7 : 1 })}>
						<View style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }}><Icon name={r.icon} size={20} /></View>
						<View style={{ flex: 1 }}><Text style={[type.headline, { color: t.text }]}>{r.label}</Text><Text style={[type.caption, { color: t.muted }]}>{r.sub}</Text></View>
					</Pressable>
				))}
			</View>
		</Screen>
	);
}
