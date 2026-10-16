// Scroll Task: one item in the centre, vertical swipe (≥ 80 pt) or buttons to move, timer that never completes anything.
import * as C from '@executar/core';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Modal, PanResponder, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button, Icon, Switch, Tag } from '@/components/ui';
import { useStore } from '@/lib/store';
import { radius, type, useTheme } from '@/lib/theme';

const ST: Record<C.ItemStatus, [string, 'neutral' | 'success' | 'warning']> = { ready: ['Pronto', 'neutral'], done: ['Concluído', 'success'], deferred: ['Adiado', 'warning'] };

export default function Executar() {
	const t = useTheme();
	const { s, a } = useStore();
	const [menu, setMenu] = useState(false);
	const ex = s.exec;
	const move = useRef(a.execMove); move.current = a.execMove;
	const pan = useRef(PanResponder.create({
		onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 24 && Math.abs(g.dy) > Math.abs(g.dx) * 2,
		onPanResponderRelease: (_, g) => { if (Math.abs(g.dy) > 80) { void Haptics.selectionAsync(); move.current(g.dy < 0 ? 1 : -1); } }
	})).current;
	const up = ex.timer.state === 'time_up';
	useEffect(() => { if (up) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); }, [up]);
	const plan = s.plan;
	if (!plan) return null;
	const q = C.executionQueue(plan, ex.gran);
	const i = Math.min(ex.idx, Math.max(0, q.length - 1)), it = q[i], tm = ex.timer;
	const left = C.timerLeft(tm), running = tm.state === 'running';
	const done = it?.status === 'done';
	const clockColor = up ? t.danger : t.text;
	const presets = [...C.PRESETS.map(m => ({ m, t: m + '′' })), { m: 1 / 6, t: '10″' }];
	const complete = (item: C.ExecItem) => {
		const isDone = item.status === 'done';
		a.mutate(p => C.setItemDone(p, item, !isDone), isDone ? 'Conclusão desfeita' : 'Item concluído');
		if (!isDone) { void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); a.say('Concluído'); if (up) a.setExec({ timer: C.timerReady(ex.minutes) }); }
	};
	const round = (bg: string) => ({ width: 44, height: 44, borderRadius: 22, backgroundColor: bg, alignItems: 'center' as const, justifyContent: 'center' as const });

	return (
		<Screen scroll={false}>
			<View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10, gap: 8, borderBottomWidth: 1, borderBottomColor: t.divider }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
					<Pressable accessibilityRole="button" accessibilityLabel="Escopo de execução" onPress={() => setMenu(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 44, paddingHorizontal: 14, borderRadius: 980, backgroundColor: t.surface }}>
						<Icon name="dots-three" size={18} /><Text style={{ fontSize: 14, color: t.text }}>{C.GRANULARITY.find(g => g.id === ex.gran)!.t}</Text>
					</Pressable>
					<Text numberOfLines={1} style={{ flex: 1, fontSize: 15, fontWeight: '600', color: t.text }}>{plan.nome}</Text>
					<Text style={[type.caption, { color: t.muted }]}>{C.pendingCount(q)} pendentes</Text>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
					{presets.map(p => {
						const on = Math.abs(ex.minutes - p.m) < 1e-6;
						return <Pressable key={p.t} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={p.m < 1 ? '10 segundos' : p.m + ' minutos'} onPress={() => a.setExec({ minutes: p.m, timer: C.timerReady(p.m) })}
							style={{ height: 44, minWidth: 44, paddingHorizontal: 8, borderRadius: 980, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? t.text : t.surface }}><Text style={{ fontSize: 13, color: on ? t.bg : t.text }}>{p.t}</Text></Pressable>;
					})}
					<View style={{ flex: 1 }} />
					<Text accessibilityRole="timer" style={{ fontSize: 17, fontWeight: '600', color: clockColor, fontVariant: ['tabular-nums'] }}>{C.fmtClock(left)}</Text>
					<Pressable accessibilityRole="button" accessibilityLabel={running ? 'Pausar timer' : 'Iniciar timer'} onPress={() => a.setExec({ timer: running ? C.timerPause(tm) : C.timerStart(up ? C.timerReady(ex.minutes) : tm) })} style={round(t.accent)}><Icon name={running ? 'pause' : 'play'} size={18} color="#fff" /></Pressable>
					<Pressable accessibilityRole="button" accessibilityLabel="Reiniciar timer" onPress={() => a.setExec({ timer: C.timerReady(ex.minutes) })} style={round(t.surface)}><Icon name="arrow-counter-clockwise" size={18} /></Pressable>
				</View>
				<View style={{ height: 3, borderRadius: 2, backgroundColor: t.surface, overflow: 'hidden' }}><View style={{ height: '100%', backgroundColor: clockColor, width: `${Math.min(100, (1 - left / Math.max(1, tm.minutes * 60000)) * 100)}%` }} /></View>
			</View>

			<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }} {...pan.panHandlers}>
				<View style={{ flex: 1, minHeight: 72, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 16, gap: 4 }}>
					<Text numberOfLines={1} style={[type.caption, { color: t.muted }]}>{q[i - 1]?.title ?? ''}</Text>
					<Pressable accessibilityRole="button" accessibilityLabel="Item anterior" onPress={() => a.execMove(-1)} style={[round('transparent'), { opacity: i > 0 ? 1 : 0.25 }]}><Icon name="caret-up" size={20} color={t.muted} /></Pressable>
				</View>
				{!it && <Text style={[type.callout, { color: t.muted, textAlign: 'center' }]}>Nenhum item neste escopo.</Text>}
				{it && (
					<Pressable accessible={false} onLongPress={() => a.setExec({ ctx: !ex.ctx })} style={{ gap: 14, paddingVertical: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: t.divider }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
							<Text style={[type.kicker, { color: t.muted }]}>{i + 1} / {q.length} · {C.GRANULARITY.find(g => g.id === it.type)!.t}</Text>
							<View style={{ flex: 1 }} />
							<Tag toneKey={(['accent', 'warning', 'neutral'] as const)[it.hz]}>{C.HZ[it.hz].nome}</Tag>
							<Tag toneKey={ST[it.status][1]}>{ST[it.status][0]}</Tag>
						</View>
						<Text accessibilityRole="header" accessibilityLiveRegion="polite" style={{ fontSize: 32, lineHeight: 35, fontWeight: '600', letterSpacing: -0.5, color: done ? t.muted : t.text, textDecorationLine: done ? 'line-through' : 'none' }}>{it.title}</Text>
						<Text style={[type.caption, { color: t.muted }]}>{it.sub}</Text>
						{up && (
							<View accessibilityRole="alert" style={{ padding: 12, borderRadius: radius.md, backgroundColor: t.surface, gap: 10 }}>
								<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Icon name="alarm" size={16} color={t.danger} /><Text style={{ fontSize: 15, fontWeight: '600', color: t.danger }}>Tempo previsto encerrado</Text></View>
								<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
									<Button block style={{ width: '48.5%' }} onPress={() => complete(it)}>Concluir</Button>
									<Button variant="secondary" block style={{ width: '48.5%' }} onPress={() => a.setExec({ timer: C.timerStart(C.timerReady(5)) })}>+5 min</Button>
									<Button variant="secondary" block style={{ width: '48.5%' }} onPress={() => { if (it.status !== 'deferred') a.mutate(p => C.deferItem(p, it.id), 'Item adiado'); a.execMove(1); }}>Adiar</Button>
									<Button variant="secondary" block style={{ width: '48.5%' }} onPress={() => a.execMove(1)}>Próxima</Button>
								</View>
							</View>
						)}
						<View style={{ flexDirection: 'row', gap: 8 }}>
							<Button block style={{ flex: 1 }} onPress={() => complete(it)}>{done ? 'Desfazer' : 'Concluir'}</Button>
							<Button variant="secondary" block style={{ flex: 1 }} onPress={() => { a.setExec({ ctx: !ex.ctx }); if (!ex.ctx) a.track('Contexto aberto'); }}>{ex.ctx ? 'Fechar' : 'Contexto'}</Button>
							<Button variant="ghost" block style={{ flex: 1 }} onPress={() => a.mutate(p => C.deferItem(p, it.id), it.status === 'deferred' ? 'Item retomado' : 'Item adiado')}>{it.status === 'deferred' ? 'Retomar' : 'Adiar'}</Button>
						</View>
						{ex.ctx && (
							<View style={{ gap: 12, padding: 14, borderRadius: radius.md, backgroundColor: t.surface }}>
								<View><Text style={[type.kicker, { color: t.muted }]}>{it.type === 'action' || it.type === 'task' ? 'Prova de conclusão' : 'Entregáveis'}</Text><Text style={[type.callout, { color: t.text, marginTop: 2 }]}>{it.context}</Text></View>
								<View><Text style={[type.kicker, { color: t.muted }]}>Progresso</Text><Text style={[type.callout, { color: t.text, marginTop: 2 }]}>{it.d} de {it.n} tarefas feitas</Text></View>
								<View style={{ gap: 6 }}>
									<Text style={[type.kicker, { color: t.muted }]}>Nota</Text>
									<TextInput multiline value={it.notes} accessibilityLabel="Nota" placeholder="O que ficou pendente ou bloqueado?" placeholderTextColor={t.muted}
										onChangeText={v => a.up(st => (st.plan ? { plan: C.setNote(st.plan, it.id, v) } : {}))} onBlur={() => { if (it.notes) a.track('Nota registrada'); }}
										style={{ minHeight: 72, borderRadius: radius.md, borderWidth: 1, borderColor: t.divider, backgroundColor: t.bg, color: t.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, textAlignVertical: 'top' }} />
								</View>
							</View>
						)}
					</Pressable>
				)}
				<View style={{ flex: 1, minHeight: 120, alignItems: 'center', paddingTop: 16, gap: 4 }}>
					<Pressable accessibilityRole="button" accessibilityLabel="Próximo item" onPress={() => a.execMove(1)} style={[round('transparent'), { opacity: i < q.length - 1 ? 1 : 0.25 }]}><Icon name="caret-down" size={20} color={t.muted} /></Pressable>
					<Text numberOfLines={1} style={[type.caption, { color: t.muted }]}>{q[i + 1]?.title ?? ''}</Text>
					<View style={{ marginTop: 'auto', flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 12, paddingBottom: 8 }}>
						<Text style={[type.caption, { color: t.muted }]}>Auto-scroll</Text>
						<Switch label="Auto-scroll" on={ex.auto} onToggle={() => { a.setExec({ auto: !ex.auto }); a.track(ex.auto ? 'Auto-scroll desligado' : 'Auto-scroll ligado'); }} />
					</View>
					<Text style={[type.micro, { color: t.muted, textAlign: 'center', paddingBottom: 12 }]}>Deslize para cima ou para baixo. Toque longo abre o contexto.</Text>
				</View>
			</ScrollView>

			<Modal visible={menu} transparent animationType="fade" onRequestClose={() => setMenu(false)}>
				<Pressable style={{ flex: 1, backgroundColor: t.scrim }} onPress={() => setMenu(false)}>
					<View accessibilityRole="menu" style={{ position: 'absolute', top: 110, left: 16, width: 220, borderRadius: radius.md, backgroundColor: t.bg, overflow: 'hidden' }}>
						{C.GRANULARITY.map((g, k) => (
							<Pressable key={g.id} accessibilityRole="menuitem" accessibilityState={{ selected: g.id === ex.gran }} onPress={() => { setMenu(false); if (g.id !== ex.gran) { a.setExec({ gran: g.id, idx: 0, ctx: false, timer: C.timerReady(ex.minutes) }); a.track('Escopo: ' + g.t); } }}
								style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44, paddingHorizontal: 14, borderTopWidth: k ? 1 : 0, borderTopColor: t.divider }}>
								<Text style={{ fontSize: 15, color: t.text }}>{g.t}</Text>{g.id === ex.gran && <Icon name="check" size={16} color={t.accent} />}
							</Pressable>
						))}
					</View>
				</Pressable>
			</Modal>
		</Screen>
	);
}
