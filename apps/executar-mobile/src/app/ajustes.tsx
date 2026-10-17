import * as C from '@executar/core';
import { router } from 'expo-router';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Group, Row, SectionLabel, Segmented, Switch } from '@/components/ui';
import { useStore } from '@/lib/store';
import { radius, type, useTheme } from '@/lib/theme';

export default function Ajustes() {
	const t = useTheme();
	const { s, a } = useStore();
	const plan = s.plan;
	if (!plan) return null;
	const sw = (label: string, sub: string, on: boolean, onToggle: () => void, first = false) => (
		<Row first={first}><View style={{ flex: 1 }}><Text style={{ fontSize: 17, color: t.text }}>{label}</Text><Text style={[type.micro, { color: t.muted }]}>{sub}</Text></View><Switch label={label} on={on} onToggle={onToggle} /></Row>
	);
	return (
		<Screen title="Ajustes" back="Conta">
			<SectionLabel>Texto das tarefas</SectionLabel>
			<View style={{ marginTop: -16 }}>
				<Segmented label="Linguagem" value={plan.lang} options={[{ value: 'p', label: 'Simples' }, { value: 'e', label: 'Executiva' }]}
					onChange={v => { a.up(st => ({ plan: st.plan ? C.setLang(st.plan, v) : st.plan, setup: { ...st.setup, lang: v } })); a.track('Linguagem alterada'); }} />
			</View>
			<SectionLabel>Notificações</SectionLabel>
			<Group style={{ marginTop: -16 }}>
				{sw('Lembretes das rotinas', 'Notificação no horário de cada rotina.', s.settings.reminders, () => a.saveSettings({ reminders: !s.settings.reminders }), true)}
				{sw('Alertas de atraso', 'Aviso diário quando uma tarefa passa da data.', s.settings.lateAlerts, () => a.saveSettings({ lateAlerts: !s.settings.lateAlerts }))}
				<Row>
					<Text style={{ flex: 1, fontSize: 17, color: t.text }}>Horário do lembrete</Text>
					<TextInput accessibilityLabel="Horário do lembrete (HH:MM)" defaultValue={s.settings.remTime} keyboardType="numbers-and-punctuation" maxLength={5}
						onEndEditing={e => { const v = e.nativeEvent.text.trim(); if (/^([01]\d|2[0-3]):[0-5]\d$/.test(v)) a.saveSettings({ remTime: v }); else a.say('Use o formato HH:MM'); }}
						style={{ minWidth: 72, textAlign: 'center', borderRadius: radius.sm, backgroundColor: t.bg, color: t.text, paddingHorizontal: 8, paddingVertical: 6, fontSize: 15 }} />
				</Row>
			</Group>
			<SectionLabel>Assistente</SectionLabel>
			<Group style={{ marginTop: -16 }}>{sw('Sugestões de tarefas', 'Propõe tarefas a partir de cada entregável.', s.settings.ai, () => a.saveSettings({ ai: !s.settings.ai }), true)}</Group>
			<Pressable accessibilityRole="button" onPress={() => Alert.alert('Apagar dados deste aparelho?', 'O plano local e a sessão saem deste aparelho. O que já foi sincronizado continua na nuvem.', [
				{ text: 'Cancelar', style: 'cancel' }, { text: 'Apagar', style: 'destructive', onPress: async () => { await a.wipe(); router.replace('/login'); } }])}
				style={{ marginTop: 24, minHeight: 52, borderRadius: radius.lg, backgroundColor: t.surface, alignItems: 'center', justifyContent: 'center' }}>
				<Text style={{ fontSize: 17, color: t.danger }}>Apagar dados deste aparelho</Text>
			</Pressable>
		</Screen>
	);
}
