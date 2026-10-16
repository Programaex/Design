// Camada de dados do CMS: documentos JSON no KV do Worker (/api/kv/<chave>), com fallback em localStorage
// quando a API não está disponível (ex.: abrir o build sem o Worker).
import React from 'react';

const LOCAL = 'executar-cms:';
export const DONE_STATES = new Set(['PUBLICADO', 'MEDIDO', 'RECICLAR']);

async function getRemote(key) {
	const r = await fetch('/api/kv/' + key, { credentials: 'same-origin' });
	if (r.status === 401) { location.href = '/login?next=' + encodeURIComponent(location.pathname + location.hash); throw new Error('sessão expirada'); }
	if (!r.ok) throw new Error('HTTP ' + r.status);
	return r.json();
}
async function putRemote(key, value) {
	const r = await fetch('/api/kv/' + key, { method: 'PUT', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(value) });
	if (!r.ok) throw new Error('HTTP ' + r.status);
}
const readLocal = key => { try { return JSON.parse(localStorage.getItem(LOCAL + key)); } catch { return null; } };
const writeLocal = (key, v) => { try { localStorage.setItem(LOCAL + key, JSON.stringify(v)); } catch {} };

// useDoc(chave, inicial) → [valor, atualizar(fn|valor), estado]. Grava com debounce de 500 ms.
export function useDoc(key, initial) {
	const [value, setValue] = React.useState(null);
	const [mode, setMode] = React.useState('loading'); // loading | kv | local
	const timer = React.useRef();
	React.useEffect(() => {
		let alive = true;
		getRemote(key)
			.then(v => { if (alive) { setValue(v ?? initial()); setMode('kv'); } })
			.catch(() => { if (alive) { setValue(readLocal(key) ?? initial()); setMode('local'); } });
		return () => { alive = false; };
	}, [key]);
	const update = React.useCallback(fn => {
		setValue(prev => {
			const next = typeof fn === 'function' ? fn(prev) : fn;
			clearTimeout(timer.current);
			timer.current = setTimeout(() => {
				writeLocal(key, next);
				putRemote(key, next).then(() => setMode('kv')).catch(() => setMode('local'));
			}, 500);
			return next;
		});
	}, [key]);
	return [value, update, mode];
}

export function useData() {
	const [data, setData] = React.useState(null);
	const [error, setError] = React.useState(null);
	React.useEffect(() => { fetch('/cms/data.json').then(r => r.json()).then(setData).catch(e => setError(String(e))); }, []);
	return { data, error };
}

// Hash router: #/rota/parametros
export function useRoute() {
	const read = () => (location.hash.replace(/^#\/?/, '') || 'painel');
	const [route, setRoute] = React.useState(read);
	React.useEffect(() => { const on = () => setRoute(read()); addEventListener('hashchange', on); return () => removeEventListener('hashchange', on); }, []);
	return route;
}
export const go = to => { location.hash = '#/' + to; };

// Registro de automações (sem backend por enquanto): guarda a intenção e o payload que seria enviado.
export function useAutomationLog() {
	const [log, setLog, mode] = useDoc('automation-log', () => ({ entries: [] }));
	const record = React.useCallback(entry => setLog(l => ({ entries: [{ at: new Date().toISOString(), ...entry }, ...(l?.entries || [])].slice(0, 200) })), [setLog]);
	return { log: log?.entries || [], record, mode };
}
