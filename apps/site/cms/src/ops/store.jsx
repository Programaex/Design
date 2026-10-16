// Documento operacional compartilhado por todas as views (ADR-001). Fonte: /api/ops (KV, com revisão).
// Primeiro acesso: semeia com /cms/ops-seed.json (3 datasets AlsoAsked + 45 registros editoriais).
// Sem API (build aberto direto), cai para localStorage e avisa.
import React from 'react';

const LOCAL = 'executar-cms:ops';
const Ctx = React.createContext(null);
export const useOps = () => React.useContext(Ctx);

async function getRemote() {
	const r = await fetch('/api/ops', { credentials: 'same-origin' });
	if (r.status === 401) { location.href = '/login?next=' + encodeURIComponent('/' + location.hash); throw new Error('sessão expirada'); }
	if (!r.ok) throw new Error('HTTP ' + r.status);
	return r.json();
}

export function OpsProvider({ children }) {
	const [doc, setDoc] = React.useState(null);
	const [mode, setMode] = React.useState('loading'); // loading | kv | local | error
	const [notice, setNotice] = React.useState(null);
	const saved = React.useRef(null); // revisão confirmada no servidor
	const queue = React.useRef(Promise.resolve());

	const load = React.useCallback(async () => {
		try {
			let d = await getRemote();
			if (!d) {
				d = await (await fetch('/cms/ops-seed.json')).json();
				const r = await fetch('/api/ops', { method: 'PUT', credentials: 'same-origin', body: JSON.stringify(d) });
				if (!r.ok) throw new Error('seed HTTP ' + r.status);
			}
			saved.current = d.revision;
			setDoc(d); setMode('kv');
		} catch (e) {
			let d = null;
			try { d = JSON.parse(localStorage.getItem(LOCAL)); } catch {}
			if (!d) d = await (await fetch('/cms/ops-seed.json')).json();
			setDoc(d); setMode('local');
			setNotice({ tone: 'warning', text: 'Sem conexão com o servidor: alterações ficam só neste navegador até reconectar.' });
		}
	}, []);
	React.useEffect(() => { load(); }, [load]);

	const persist = React.useCallback(next => {
		try { localStorage.setItem(LOCAL, JSON.stringify(next)); } catch {}
		if (mode !== 'kv') return;
		queue.current = queue.current.then(async () => {
			const r = await fetch('/api/ops', { method: 'PUT', credentials: 'same-origin', headers: { 'if-match': String(saved.current) }, body: JSON.stringify(next) }).catch(() => null);
			if (r && r.ok) { saved.current = next.revision; return; }
			if (r && r.status === 409) {
				setNotice({ tone: 'danger', text: 'Conflito: outra sessão alterou os dados. Recarreguei a versão do servidor; refaça a última alteração.' });
				await load();
				return;
			}
			setNotice({ tone: 'warning', text: 'Não foi possível salvar no servidor. A alteração ficou neste navegador; tente de novo.' });
		});
	}, [mode, load]);

	// apply(fn): fn(doc) → { doc, error, ... } de lib/ops/model.mjs. Devolve o resultado para a view.
	const docRef = React.useRef(null);
	docRef.current = doc;
	const apply = React.useCallback(fn => {
		const cur = docRef.current;
		const result = fn(cur);
		if (result?.error) { setNotice({ tone: 'danger', text: result.error }); return result; }
		if (result?.doc && result.doc !== cur) { docRef.current = result.doc; setDoc(result.doc); persist(result.doc); }
		return result;
	}, [persist]);

	const replace = React.useCallback(next => { docRef.current = next; setDoc(next); persist(next); }, [persist]);

	const value = React.useMemo(() => ({ doc, mode, apply, replace, notice, setNotice, reload: load }), [doc, mode, apply, replace, notice, load]);
	return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Filtros compartilhados entre views (campanha, responsável, canal, status).
export const FILTER_KEYS = ['projectId', 'ownerId', 'categoryId', 'status'];
export function applyTaskFilters(tasks, filters) {
	return tasks.filter(t => FILTER_KEYS.every(k => !filters[k] || (filters[k] === '__none' ? !t[k] : t[k] === filters[k])));
}
