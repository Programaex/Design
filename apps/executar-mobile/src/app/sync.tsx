import * as C from '@executar/core';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button, Group, Icon, Row, SectionLabel, Switch, Tag } from '@/components/ui';
import { API_URL } from '@/lib/api';
import { syncInfo, useStore } from '@/lib/store';
import { radius, tone, type, useTheme } from '@/lib/theme';

export default function Sync() {
	const t = useTheme();
	const { s, a } = useStore();
	const sy = syncInfo(s), c = s.conflict;
	const exists = c && s.plan && s.plan.ents.some(e => e.tarefas.some(x => x.id === c.taskId));
	return (
		<Screen title="Sincronização" back="Conta">
			<View style={{ alignItems: 'center', gap: 6, paddingVertical: 24, paddingHorizontal: 16, borderRadius: radius.lg, backgroundColor: t.surface }}>
				{sy.kind === 'syncing' ? <ActivityIndicator size="large" color={t.accent} /> : <Icon name={sy.icon} size={44} color={sy.dot === 'neutral' ? t.neutral400 : tone(t, sy.dot)[1]} />}
				<Text style={[type.card, { color: t.text, marginTop: 4 }]}>{sy.title}</Text>
				<Text style={[type.caption, { color: t.muted, textAlign: 'center' }]}>{sy.desc}</Text>
				<View style={{ marginTop: 12 }}><Button onPress={a.syncNow}>Sincronizar agora</Button></View>
			</View>
			{c && (
				<View style={{ marginTop: 20, padding: 16, borderRadius: radius.lg, borderWidth: 1, borderColor: t.danger }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Icon name="warning" size={16} color={t.danger} /><Text style={{ fontSize: 14, fontWeight: '600', color: t.danger }}>Conflito em uma tarefa</Text></View>
					<Text style={[type.caption, { color: t.muted, marginTop: 6, marginBottom: 12 }]}>{c.by} editou a mesma tarefa enquanto você estava sem conexão. Escolha a versão que fica.{exists ? '' : ' (A tarefa não existe mais.)'}</Text>
					<View style={{ flexDirection: 'row', gap: 8 }}>
						{(['local', 'remote'] as const).map(side => (
							<Pressable key={side} accessibilityRole="button" onPress={() => a.resolve(side)} style={{ flex: 1, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: t.divider, backgroundColor: t.bg, gap: 4 }}>
								<Text style={[type.micro, { color: t.muted }]}>{side === 'local' ? 'Este aparelho' : 'Nuvem'}</Text>
								<Text style={[type.caption, { color: t.text }]}>{c[side].custom}</Text>
								<View style={{ marginTop: 4 }}><Tag toneKey={c[side].done ? 'success' : 'neutral'}>{c[side].done ? 'Feito' : 'Aberta'}</Tag></View>
							</Pressable>
						))}
					</View>
				</View>
			)}
			<SectionLabel>Fila de envio</SectionLabel>
			<Group>
				{!s.outbox.length && <Row first><Text style={[type.callout, { color: t.muted }]}>Nada pendente.</Text></Row>}
				{s.outbox.map((o, i) => (
					<Row key={o.id} first={!i}><Icon name="clock" size={16} color={t.warning} /><Text style={{ flex: 1, fontSize: 15, color: t.text }}>{o.label}</Text><Text style={[type.micro, { color: t.muted }]}>{new Date(o.at).toTimeString().slice(0, 5)}</Text></Row>
				))}
			</Group>
			<Group style={{ marginTop: 20 }}>
				<Row first>
					<View style={{ flex: 1 }}><Text style={{ fontSize: 17, color: t.text }}>Modo offline</Text><Text style={[type.micro, { color: t.muted }]}>Edições entram na fila até a conexão voltar.</Text></View>
					<Switch label="Modo offline" on={s.offline} onToggle={() => a.setOffline(!s.offline)} />
				</Row>
			</Group>
			<Text style={[type.micro, { color: t.muted, marginTop: 12, marginHorizontal: 4 }]}>Servidor: {API_URL} · plano {s.plan ? s.plan.id : '—'} · versão {s.plan ? s.plan.version : '—'} · {s.plan ? C.fmt(s.plan.rotDate) : ''}</Text>
		</Screen>
	);
}
