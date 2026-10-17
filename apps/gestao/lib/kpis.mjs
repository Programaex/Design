// Indicadores do painel. Cada KPI traz a regra de cálculo e os números das issues que o compõem (drill-down).
// Sem dado de origem, o valor é "N/D"; nada é estimado.

export const DAY = 86400000;
export const iso = d => d.toISOString().slice(0, 10);
export const parseDay = s => (s ? new Date(s + 'T00:00:00Z') : null);
export const daysBetween = (a, b) => Math.round((parseDay(b) - parseDay(a)) / DAY);

export const isDone = i => i.state === 'closed';
// Prazo efetivo: data definida ou fim da janela "a definir".
export const dueOf = i => i.due || (i.dueWindow && i.dueWindow[1]) || null;
export const isLate = (i, today) => !isDone(i) && !!i.due && i.due < today;
export const isDueSoon = (i, today, days = 7) => !isDone(i) && !!i.due && i.due >= today && daysBetween(today, i.due) <= days;
export const isBlocked = (i, byNumber) => !isDone(i) && !!i.blockedBy && byNumber.has(i.blockedBy) && !isDone(byNumber.get(i.blockedBy));
export const isActive = (i, today) => !isDone(i) && !!i.start && i.start <= today && (dueOf(i) || i.start) >= today;

const kpi = (id, label, value, sub, rule, items = []) => ({ id, label, value, sub, rule, numbers: items.map(i => i.number) });

export function computeKpis(items, view, today) {
	const byNumber = new Map(items.map(i => [i.number, i]));
	const issues = items.filter(i => i.type !== 'gate');
	const gates = items.filter(i => i.type === 'gate');
	const done = issues.filter(isDone);
	const late = items.filter(i => isLate(i, today));
	const soon = items.filter(i => isDueSoon(i, today));
	const blocked = items.filter(i => isBlocked(i, byNumber));
	const openHours = issues.filter(i => !isDone(i) && i.horas).reduce((a, i) => a + i.horas, 0);
	const nextGate = gates.filter(g => !isDone(g) && dueOf(g)).sort((a, b) => dueOf(a).localeCompare(dueOf(b)))[0] || null;
	const pct = issues.length ? Math.round((done.length / issues.length) * 100) : null;

	const out = [
		kpi('progresso', 'Concluídas', `${done.length}/${issues.length}`, pct === null ? 'N/D' : `${pct}% das issues`, 'Issues fechadas no GitHub ÷ issues do épico (gates fora da conta).', done),
		kpi('atrasadas', 'Atrasadas', String(late.length), 'prazo vencido e aberta', 'Itens abertos com prazo definido anterior a hoje.', late),
		kpi('vencendo', 'Vencem em 7 dias', String(soon.length), 'prazo nos próximos 7 dias', 'Itens abertos com prazo entre hoje e hoje + 7.', soon),
		kpi('bloqueadas', 'Bloqueadas', String(blocked.length), 'dependência ainda aberta', 'Itens abertos cuja issue em "Bloqueada por" ainda está aberta.', blocked),
		kpi('horas', 'Horas abertas', issues.some(i => i.horas) ? `${String(openHours).replace('.', ',')} h` : 'N/D', 'estimativa do plano', 'Soma do "Tempo estimado" das issues abertas (estimativa do plano, não medição).', issues.filter(i => !isDone(i) && i.horas)),
		kpi('gate', 'Próximo ponto de decisão', nextGate ? (nextGate.alias || `#${nextGate.number}`) : '—', nextGate ? `${fmtDay(dueOf(nextGate))} · ${nextGate.title}` : 'nenhum aberto', 'Gate aberto com o prazo mais próximo.', nextGate ? [nextGate] : []),
	];
	if (view.exams) {
		const exams = items.filter(i => view.exams.includes(i.alias));
		out.push(kpi('provas', 'Provas realizadas', `${exams.filter(isDone).length}/${view.exams.length}`, exams.some(e => !e.due) ? 'datas oficiais a definir' : 'datas definidas', 'Issues de prova (simulado final + prova) fechadas.', exams));
		out.push(kpi('candidaturas', 'Candidaturas enviadas', 'N/D', 'sem fonte registrada', 'Contagem da planilha de candidaturas; ainda não existe fonte ligada ao painel (meta semanal a definir).'));
	}
	return out;
}

export function milestonesWithDays(view, today) {
	return view.milestones.map(m => ({ ...m, days: daysBetween(today, m.date) }));
}

export const fmtDay = s => (s ? `${s.slice(8, 10)}/${s.slice(5, 7)}` : 'a definir');
export const fmtDate = s => (s ? `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}` : 'a definir');

// Agrupa itens em linhas do Gantt, na ordem da view; grupos fora da ordem vão ao fim e gates por último.
export function groupRows(items, view) {
	const groups = new Map();
	for (const i of items) {
		const g = view.groupOf(i);
		if (!groups.has(g)) groups.set(g, []);
		groups.get(g).push(i);
	}
	const order = [...view.groupOrder.filter(g => groups.has(g)), ...[...groups.keys()].filter(g => !view.groupOrder.includes(g) && g !== 'Pontos de decisão')];
	if (groups.has('Pontos de decisão')) order.push('Pontos de decisão');
	return order.map(name => ({ name, items: groups.get(name).sort((a, b) => (a.start || '').localeCompare(b.start || '')) }));
}

// Janela do Gantt: do menor início ao maior prazo (inclui marcos).
export function range(items, view) {
	const days = [...items.flatMap(i => [i.start, dueOf(i)]), ...view.milestones.map(m => m.date)].filter(Boolean).sort();
	return { from: days[0], to: days[days.length - 1] };
}

// Itens com atividade numa janela [today, today + n] (início ou prazo dentro, ou em andamento).
export function upcoming(items, today, n = 14) {
	const end = iso(new Date(parseDay(today).getTime() + n * DAY));
	return items
		.filter(i => !isDone(i) && ((i.start && i.start <= end && (dueOf(i) || i.start) >= today) || isLate(i, today)))
		.sort((a, b) => (dueOf(a) || '9999').localeCompare(dueOf(b) || '9999'));
}

export const lacunas = items => items.filter(i => !isDone(i) && i.lacunas?.length).flatMap(i => i.lacunas.map(l => ({ text: l, number: i.number, alias: i.alias })));
