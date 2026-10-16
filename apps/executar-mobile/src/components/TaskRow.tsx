import * as C from '@executar/core';
import { Pressable, Text, View } from 'react-native';
import { useStore } from '@/lib/store';
import { radius, useTheme } from '@/lib/theme';
import { Check, Icon, Tag } from './ui';

export function TaskRow({ plan, t: task, e, onEdit }: { plan: C.Plan; t: C.Task; e: C.Deliverable; onEdit: (task: C.Task) => void }) {
	const t = useTheme();
	const { a } = useStore();
	const st = C.statusOf(plan, task, e.hz);
	const text = C.taskText(task, plan.lang);
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 48, borderRadius: radius.md, backgroundColor: t.bg, paddingHorizontal: 4 }}>
			<Pressable accessibilityRole="checkbox" accessibilityState={{ checked: task.done }} accessibilityLabel={'Marcar tarefa: ' + text} onPress={() => a.mutate(p => C.toggleTask(p, task.id), task.done ? 'Tarefa reaberta' : 'Tarefa concluída')}
				style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Check done={task.done} /></Pressable>
			<Pressable accessibilityRole="button" accessibilityHint="Editar tarefa" onPress={() => onEdit(task)} style={{ flex: 1, paddingVertical: 6 }}>
				<Text style={{ fontSize: 15, lineHeight: 20, color: task.done ? t.muted : t.text, textDecorationLine: task.done ? 'line-through' : 'none' }}>{text}</Text>
			</Pressable>
			<Tag toneKey={st.tone}>{st.label}</Tag>
			<Pressable accessibilityRole="button" accessibilityLabel="Remover tarefa" onPress={() => { a.mutate(p => C.removeTask(p, task.id), 'Tarefa removida'); a.say('Tarefa removida'); }} style={{ width: 36, height: 44, alignItems: 'center', justifyContent: 'center' }}><Icon name="trash" size={16} color={t.muted} /></Pressable>
		</View>
	);
}
