import * as C from '@executar/core';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Sheet } from '@/components/Sheet';
import { TaskRow } from '@/components/TaskRow';
import { Field, Icon, Progress } from '@/components/ui';
import { isOpen, useStore } from '@/lib/store';
import { radius, type, useTheme } from '@/lib/theme';

type Edit = { kind: 'add'; entId: string; title: string } | { kind: 'rename'; taskId: string } | null;

export default function PrismaTab() {
	const t = useTheme();
	const { s, a } = useStore();
	const [edit, setEdit] = useState<Edit>(null);
	const [draft, setDraft] = useState('');
	const plan = s.plan;
	if (!plan) return null;
	const lang = plan.lang, L = (p: string, e: string) => (lang === 'e' ? e : p);
	const all = C.prog(plan.ents), late = C.lateCount(plan);
	const stats = [
		{ label: 'Entregáveis', value: plan.ents.length, note: C.groupsUsed(plan).length + ' grupos', color: t.text },
		{ label: L('Tarefas feitas', 'Ações concluídas'), value: all.d + '/' + all.n, note: 'no total', color: t.text },
		{ label: 'Concluído', value: C.pct(all) + '%', note: 'do plano', color: t.text },
		{ label: 'Em atraso', value: late, note: late ? L('pedem nova data', 'pedem reprevisão') : 'tudo no prazo', color: late ? t.danger : t.text }
	];
	const confirm = () => {
		const v = draft.trim();
		if (edit?.kind === 'add') { if (!v) return; a.mutate(p => C.addTask(p, edit.entId, v), 'Tarefa adicionada'); a.say('Tarefa adicionada'); }
		if (edit?.kind === 'rename') { if (v) a.mutate(p => C.renameTask(p, edit.taskId, v), 'Tarefa editada'); else a.mutate(p => C.removeTask(p, edit.taskId), 'Tarefa removida'); }
		setEdit(null);
	};
	return (
		<Screen>
			<Text style={[type.kicker, { color: t.muted }]}>{plan.nome} · {C.fmt(plan.inicio)} → {C.fmt(C.endDate(plan))}</Text>
			<Text accessibilityRole="header" style={[type.large, { color: t.text, marginTop: 4, marginBottom: 6 }]}>Agora, próximo{'\n'}e depois.</Text>
			<Text style={[type.callout, { color: t.muted }]}>{L('Comece pelo que vence primeiro. Toque no texto de uma tarefa para editar.', 'Priorize o caminho crítico. Toque em uma ação para editar.')}</Text>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
				{stats.map(st => (
					<View key={st.label} style={{ width: '48.5%', backgroundColor: t.surface, borderRadius: radius.lg, paddingHorizontal: 16, paddingVertical: 14 }}>
						<Text style={[type.micro, { color: t.muted }]}>{st.label}</Text>
						<Text style={{ fontSize: 28, fontWeight: '600', letterSpacing: -0.5, marginTop: 4, color: st.color, fontVariant: ['tabular-nums'] }}>{st.value}</Text>
						<Text style={[type.micro, { color: t.muted }]}>{st.note}</Text>
					</View>
				))}
			</View>
			<View style={{ gap: 28, marginTop: 32 }}>
				{C.HZ.map((h, i) => {
					const es = plan.ents.filter(e => e.hz === i), pr = C.prog(es), k = 'h:' + i, open = isOpen(s.open, k, true);
					return (
						<View key={i}>
							<Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => a.toggleOpen(k, true)} style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
								<View style={{ flex: 1 }}>
									<Text style={[type.kicker, { color: t.muted }]}>{String(i + 1).padStart(2, '0')} · {h.nome} · {C.fmt(C.hzDate(plan, i))}</Text>
									<Text style={[type.card, { color: t.text, marginTop: 2 }]}>{h.tit[lang]}</Text>
								</View>
								<Text style={[type.caption, { color: t.muted, fontVariant: ['tabular-nums'] }]}>{pr.d}/{pr.n}</Text>
								<View style={{ transform: [{ rotate: open ? '0deg' : '-90deg' }], marginBottom: 3 }}><Icon name="caret-down" size={16} color={t.muted} /></View>
							</Pressable>
							<View style={{ marginTop: 10 }}><Progress pct={C.pct(pr)} /></View>
							{open && (
								<View style={{ gap: 8, marginTop: 12 }}>
									{!es.length && <Text style={[type.caption, { color: t.muted, paddingVertical: 8 }]}>Nenhum entregável neste horizonte.</Text>}
									{es.map(e => {
										const ep = C.prog([e]), ek = 'e:' + e.id, eo = isOpen(s.open, ek, false);
										return (
											<View key={e.id} style={{ backgroundColor: t.surface, borderRadius: radius.lg, overflow: 'hidden' }}>
												<Pressable accessibilityRole="button" accessibilityState={{ expanded: eo }} onPress={() => a.toggleOpen(ek, false)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 56, paddingHorizontal: 16, paddingVertical: 12 }}>
													<View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.GROUPS[e.grupo].hex }} />
													<View style={{ flex: 1 }}><Text style={[type.micro, { color: t.muted }]}>{C.GROUPS[e.grupo].nome}</Text><Text style={[type.headline, { color: t.text }]}>{e.titulo}</Text></View>
													<Text style={[type.caption, { color: t.muted }]}>{ep.d}/{ep.n}</Text>
													<View style={{ transform: [{ rotate: eo ? '90deg' : '0deg' }] }}><Icon name="caret-right" size={14} color={t.muted} /></View>
												</Pressable>
												{eo && (
													<View style={{ paddingHorizontal: 12, paddingBottom: 14, gap: 6 }}>
														<View style={{ backgroundColor: t.bg, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 4 }}>
															<Text style={[type.kicker, { color: t.muted }]}>{L('Prova de conclusão', 'Evidência de conclusão')}</Text>
															<Text style={[type.caption, { color: t.text, marginTop: 2 }]}>{C.provaText(e, lang)}</Text>
														</View>
														{e.tarefas.map(task => <TaskRow key={task.id} plan={plan} t={task} e={e} onEdit={tk => { setDraft(C.taskText(tk, lang)); setEdit({ kind: 'rename', taskId: tk.id }); }} />)}
														<Pressable accessibilityRole="button" onPress={() => { setDraft(''); setEdit({ kind: 'add', entId: e.id, title: e.titulo }); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 44, paddingHorizontal: 8 }}>
															<Icon name="plus" size={16} color={t.link} /><Text style={{ fontSize: 15, color: t.link }}>{L('Adicionar tarefa', 'Incluir ação')}</Text>
														</Pressable>
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
			<View style={{ marginTop: 32, padding: 16, borderRadius: radius.lg, backgroundColor: t.surface }}>
				<Text style={[type.kicker, { color: t.muted }]}>Pergunta de controle</Text>
				<Text style={[type.callout, { color: t.text, marginTop: 4 }]}>A prova de conclusão existe? Se não existe, o entregável ainda não terminou.</Text>
			</View>
			<Sheet open={!!edit} title={edit?.kind === 'add' ? L('Nova tarefa', 'Nova ação') : 'Editar tarefa'} desc={edit?.kind === 'add' ? edit.title : undefined} cta={edit?.kind === 'add' ? 'Adicionar' : 'Salvar'} onConfirm={confirm} onClose={() => setEdit(null)}>
				<Field label="Tarefa" value={draft} onChangeText={setDraft} autoFocus placeholder={edit?.kind === 'add' ? 'O que precisa ser feito?' : 'Deixe vazio para remover'} onSubmitEditing={confirm} returnKeyType="done" />
			</Sheet>
		</Screen>
	);
}
