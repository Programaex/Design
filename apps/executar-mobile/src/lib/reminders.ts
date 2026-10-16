// Local notifications (no push server needed): one daily reminder per routine at its time, plus a daily late-task
// alert at the chosen time while something is overdue. Rescheduled whenever the plan or the settings change.
import * as C from '@executar/core';
import * as Notifications from 'expo-notifications';
import type { Settings } from './api';

Notifications.setNotificationHandler({
	handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false })
});

const daily = (hhmm: string) => {
	const [hour, minute] = hhmm.split(':').map(Number);
	return { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute } as const;
};

export async function rescheduleReminders(plan: C.Plan | null, settings: Settings): Promise<'ok' | 'denied' | 'off'> {
	await Notifications.cancelAllScheduledNotificationsAsync();
	if (!plan || (!settings.reminders && !settings.lateAlerts)) return 'off';
	const perm = await Notifications.getPermissionsAsync();
	const granted = perm.granted || (perm.canAskAgain && (await Notifications.requestPermissionsAsync()).granted);
	if (!granted) return 'denied';
	const lang = plan.lang;
	if (settings.reminders) {
		for (const r of plan.rotinas) {
			const R = C.ROT[r.k];
			if (!R || R.at === '—') continue;
			await Notifications.scheduleNotificationAsync({ content: { title: R.n[lang], body: R.d[lang] }, trigger: daily(R.at) });
		}
	}
	const late = C.lateCount(plan);
	if (settings.lateAlerts && late) {
		await Notifications.scheduleNotificationAsync({
			content: { title: 'Tarefas em atraso', body: `${late} tarefa${late > 1 ? 's' : ''} de “${plan.nome}” ${late > 1 ? 'pedem' : 'pede'} nova data.` },
			trigger: daily(settings.remTime)
		});
	}
	return 'ok';
}
