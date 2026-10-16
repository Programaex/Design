// Operações e Dados: cabeçalho de projeto/campanha, seletor de views e filtros compartilhados.
// Todas as views leem o mesmo documento (projeções): editar em uma reflete nas outras.
import React from 'react';
import { useDoc } from '../store.js';
import { Calendar } from './calendar.jsx';
import { Dashboard } from './dashboard.jsx';
import { Export } from './export.jsx';
import { Focus } from './focus.jsx';
import { Gantt } from './gantt.jsx';
import { Importer } from './importer.jsx';
import { MindMap } from './mindmap.jsx';
import { Filters, Notice, TaskDialog, VIEWS } from './shared.jsx';
import { applyTaskFilters, OpsProvider, useOps } from './store.jsx';
import { Workflow } from './workflow.jsx';

// Filtros que não se aplicam a cada view (são exibidos como "não se aplica", nunca escondem dados em silêncio).
const INAPPLICABLE = { mapa: ['projectId', 'ownerId', 'categoryId', 'status'], importar: ['projectId', 'ownerId', 'categoryId', 'status'] };

function Ops({ view }) {
	const { doc } = useOps();
	const [vs, setVs] = useDoc('viewstate', () => ({ filters: {} }));
	const [editing, setEditing] = React.useState(null);
	if (!doc || !vs) return <p className="cms-page text-muted">Carregando dados operacionais…</p>;
	const filters = vs.filters || {};
	const setFilters = fn => setVs(v => ({ ...v, filters: typeof fn === 'function' ? fn(v.filters || {}) : fn }));
	const viewState = vs[view] || {};
	const setViewState = fn => setVs(v => ({ ...v, [view]: typeof fn === 'function' ? fn(v[view] || {}) : fn }));
	const tasks = applyTaskFilters(doc.tasks, filters);
	const openTask = t => setEditing(doc.tasks.find(x => x.id === (t.id || t)) || null);
	const props = { doc, tasks, openTask, viewState, setViewState, filters };
	const body = {
		dashboard: <Dashboard {...props} />, calendario: <Calendar {...props} />, gantt: <Gantt {...props} />, mapa: <MindMap {...props} />,
		workflow: <Workflow {...props} />, foco: <Focus {...props} />, importar: <Importer {...props} />, exportar: <Export {...props} viewState={vs} />,
	}[view] || <Dashboard {...props} />;
	return (
		<div className="cms-page ops">
			<header className="cms-head ops-head">
				<div><span className="cms-kicker">Operações e Dados · projeto executar-lancamento</span><h1>{(VIEWS.find(v => v[0] === view) || VIEWS[0])[1]}</h1>
					<p className="text-muted ops-small">{doc.tasks.length} tarefas · {doc.dependencies.length} dependências · {doc.nodes.length} perguntas em {doc.datasets.length} datasets · revisão {doc.revision}</p></div>
			</header>
			<nav className="ops-tabs" aria-label="Views">
				{VIEWS.map(([id, label, icon]) => <a key={id} href={'#/ops/' + id} className={'ops-tab' + (view === id ? ' is-on' : '')} aria-current={view === id ? 'page' : undefined}><i className={'ph ' + icon} />{label}</a>)}
			</nav>
			<Notice />
			{!['importar'].includes(view) && <Filters filters={filters} setFilters={setFilters} tasks={doc.tasks} inapplicable={INAPPLICABLE[view] || []} />}
			{tasks.length < doc.tasks.length && !['mapa', 'importar'].includes(view) && <p className="text-muted ops-small">{doc.tasks.length - tasks.length} tarefa(s) ocultas pelos filtros.</p>}
			{body}
			{editing && <TaskDialog key={editing.id + editing.revision} task={editing} onClose={() => setEditing(null)} />}
		</div>
	);
}

export function OpsArea({ view }) {
	return <OpsProvider><Ops view={view || 'dashboard'} /></OpsProvider>;
}
