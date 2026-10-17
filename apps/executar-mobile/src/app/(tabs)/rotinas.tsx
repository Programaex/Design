import * as C from '@executar/core';
import { Pressable, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button, Check, Icon, Progress } from '@/components/ui';
import { useStore } from '@/lib/store';
import { radius, type, useTheme } from '@/lib/theme';

export default function Rotinas() {
	const t = useTheme();
	const { s, a } = useStore();
	const plan = s.plan;
	if (!plan) return null;
	const done = plan.rotinas.filter(r => r.done).length;
	return (
		<Screen title="Rotinas do dia" sub={`${done} de ${plan.rotinas.length} feitas hoje. Reiniciam toda manhã.`}>
			<View style={{ marginTop: -6 }}><Progress pct={plan.rotinas.length ? done / plan.rotinas.length * 100 : 0} /></View>
			<View style={{ gap: 8, marginTop: 20 }}>
				{plan.rotinas.filter(r => C.ROT[r.k]).map(r => {
					const R = C.ROT[r.k];
					return (
						<Pressable key={r.id} accessibilityRole="checkbox" accessibilityState={{ checked: r.done }} onPress={() => a.mutate(p => C.toggleRoutine(p, r.id), 'Rotina marcada')}
							style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderRadius: radius.lg, backgroundColor: t.surface }}>
							<Check done={r.done} size={26} />
							<View style={{ flex: 1 }}>
								<Text style={[type.micro, { color: t.muted }]}>{R.w}</Text>
								<Text style={[type.headline, { color: t.text, textDecorationLine: r.done ? 'line-through' : 'none' }]}>{R.n[plan.lang]}</Text>
								<Text style={[type.caption, { color: t.muted, marginTop: 2 }]}>{R.d[plan.lang]}</Text>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Icon name={s.settings.reminders && R.at !== '—' ? 'bell' : 'bell-slash'} size={12} color={t.muted} /><Text style={[type.micro, { color: t.muted }]}>{R.at}</Text></View>
						</Pressable>
					);
				})}
				{!plan.rotinas.length && <Text style={[type.callout, { color: t.muted }]}>Nenhuma rotina escolhida. Refaça o questionário para adicionar.</Text>}
			</View>
			<View style={{ marginTop: 12 }}><Button variant="ghost" onPress={() => { a.mutate(p => C.resetRoutines(p), 'Rotinas zeradas'); a.say('Dia reiniciado'); }}>Zerar o dia</Button></View>
		</Screen>
	);
}
