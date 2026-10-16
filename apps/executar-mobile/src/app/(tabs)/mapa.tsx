import * as C from '@executar/core';
import { Pressable, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button, Check, Icon, Progress, Tag } from '@/components/ui';
import { isOpen, useStore } from '@/lib/store';
import { radius, type, useTheme } from '@/lib/theme';

export default function Mapa() {
	const t = useTheme();
	const { s, a } = useStore();
	const plan = s.plan;
	if (!plan) return null;
	const all = C.prog(plan.ents);
	const line = (left: number, top: number, w: number) => <View style={{ position: 'absolute', left, top, width: w, borderTopWidth: 2, borderTopColor: t.divider }} />;
	return (
		<Screen title="Mapa mental" sub="Toque em um nó para abrir o próximo nível.">
			<View style={{ flexDirection: 'row', gap: 4, marginTop: -8, marginBottom: 20 }}>
				<Button variant="secondary" size="sm" onPress={() => a.setAll(true)}>Abrir tudo</Button>
				<Button variant="ghost" size="sm" onPress={() => a.setAll(false)}>Fechar tudo</Button>
			</View>
			<View style={{ backgroundColor: t.section, borderRadius: radius.lg, padding: 16 }}>
				<Text style={[type.micro, { color: t.onSection, opacity: 0.7 }]}>Mapa de trabalho</Text>
				<Text style={[type.card, { color: t.onSection, marginTop: 2 }]}>{plan.nome}</Text>
				<Text style={[type.micro, { color: t.onSection, opacity: 0.7, marginTop: 4 }]}>{C.fmt(plan.inicio)} → {C.fmt(C.endDate(plan))} · {all.d}/{all.n} feitas</Text>
				<View style={{ marginTop: 10 }}><Progress pct={C.pct(all)} color={t.onSection} track={t.sectionGhost} /></View>
			</View>
			<View style={{ marginLeft: 20, paddingLeft: 16, borderLeftWidth: 2, borderLeftColor: t.divider, paddingTop: 12, gap: 10 }}>
				{C.groupsUsed(plan).map(g => {
					const es = plan.ents.filter(e => e.grupo === g), pr = C.prog(es), k = 'g:' + g, open = isOpen(s.open, k, true);
					return (
						<View key={g}>
							{line(-16, 28, 14)}
							<Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => a.toggleOpen(k, true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: radius.lg, borderWidth: 1, borderColor: t.divider, backgroundColor: t.bg }}>
								<View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: t.surface, alignItems: 'center', justifyContent: 'center' }}>
									<Icon name={C.GROUPS[g].ic} size={16} />
									<View style={{ position: 'absolute', right: -2, bottom: -2, width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: t.bg, backgroundColor: C.GROUPS[g].hex }} />
								</View>
								<View style={{ flex: 1 }}><Text style={[type.headline, { color: t.text }]}>{C.GROUPS[g].nome}</Text><Text style={[type.micro, { color: t.muted }]}>{es.length} entregáveis · {C.pct(pr)}%</Text></View>
								<View style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}><Icon name="caret-right" size={14} color={t.muted} /></View>
							</Pressable>
							{open && (
								<View style={{ marginLeft: 20, paddingLeft: 14, borderLeftWidth: 2, borderLeftColor: t.divider, paddingTop: 8, gap: 8 }}>
									{es.map(e => {
										const ep = C.prog([e]), dk = 'd:' + e.id, eo = isOpen(s.open, dk, false);
										return (
											<View key={e.id}>
												{line(-14, 24, 12)}
												<Pressable accessibilityRole="button" accessibilityState={{ expanded: eo }} onPress={() => a.toggleOpen(dk, false)} style={{ paddingHorizontal: 12, paddingVertical: 10, borderRadius: radius.md, backgroundColor: t.surface }}>
													<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Tag toneKey={(['accent', 'warning', 'neutral'] as const)[e.hz]}>{C.HZ[e.hz].nome} · {C.fmt(C.hzDate(plan, e.hz))}</Tag><Text style={[type.micro, { color: t.muted }]}>{ep.d}/{ep.n}</Text></View>
													<Text style={{ fontSize: 15, fontWeight: '600', marginTop: 6, color: t.text }}>{e.titulo}</Text>
													<View style={{ marginTop: 8 }}><Progress pct={C.pct(ep)} height={3} track={t.divider} /></View>
												</Pressable>
												{eo && (
													<View style={{ marginLeft: 16, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: t.divider, paddingTop: 6, gap: 6 }}>
														{e.tarefas.map(task => (
															<Pressable key={task.id} accessibilityRole="checkbox" accessibilityState={{ checked: task.done }} onPress={() => a.mutate(p => C.toggleTask(p, task.id), task.done ? 'Tarefa reaberta' : 'Tarefa concluída')}
																style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, paddingVertical: 4, paddingLeft: 6, paddingRight: 10, borderRadius: radius.md, borderWidth: 1, borderColor: t.divider, backgroundColor: t.bg }}>
																<Check done={task.done} size={20} />
																<Text style={{ flex: 1, fontSize: 14, lineHeight: 19, color: task.done ? t.muted : t.text, textDecorationLine: task.done ? 'line-through' : 'none' }}>{C.taskText(task, plan.lang)}</Text>
															</Pressable>
														))}
														<View style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: radius.md, borderWidth: 1, borderStyle: 'dashed', borderColor: t.divider }}>
															<Text style={[type.kicker, { color: t.muted }]}>Prova</Text>
															<Text style={{ fontSize: 13, lineHeight: 18, marginTop: 2, color: t.text }}>{C.provaText(e, plan.lang)}</Text>
														</View>
													</View>
												)}
											</View>
										);
									})}
								</View>
							)}
						</View>
					);
				})}
			</View>
		</Screen>
	);
}
