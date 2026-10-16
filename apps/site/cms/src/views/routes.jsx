// Catálogo de rotas e links com QR Code (modelo "Rotas e links"), a partir do EXECUTAR_rotas.csv.
import React from 'react';
import QRCode from 'qrcode';
import { Button, RouteCard, SegmentedControl, TextField } from '../ds.js';
import { useDoc } from '../store.js';

const DEFAULT_BASE = 'https://design.bus-programa.workers.dev';

function Qr({ text }) {
	const [src, setSrc] = React.useState(null);
	React.useEffect(() => { QRCode.toDataURL(text, { margin: 1, width: 192, errorCorrectionLevel: 'M' }).then(setSrc); }, [text]);
	return src ? <img src={src} alt={'QR Code de ' + text} /> : null;
}

// Rotas concretas apontam para o site real (preview do ecossistema); dinâmicas usam um slug de exemplo.
export const previewPath = url => '/ui_kits/ecossistema/#' + url.replace('[slug]', 'exemplo-1');

export function RoutesView({ data }) {
	const [settings, setSettings] = useDoc('settings', () => ({ qrBase: DEFAULT_BASE }));
	const [group, setGroup] = React.useState('todos');
	const [q, setQ] = React.useState('');
	const [copied, setCopied] = React.useState(null);
	const base = (settings?.qrBase || DEFAULT_BASE).replace(/\/$/, '');
	const groups = [...new Set(data.routes.map(r => r.group))];
	const shown = data.routes.filter(r => (group === 'todos' || r.group === group) && (!q || (r.title + r.url + r.id).toLowerCase().includes(q.toLowerCase())));
	const copy = async u => { await navigator.clipboard?.writeText(u); setCopied(u); setTimeout(() => setCopied(null), 1500); };
	const stats = { pub: data.routes.filter(r => r.access === 'publico').length, adm: data.routes.filter(r => r.access === 'administrador').length };
	return (
		<div className="cms-page">
			<header className="cms-head"><div><span className="cms-kicker">Rotas e links</span><h1>Catálogo com QR Code</h1>
				<p className="text-muted">Toda nova rota entra no <code>EXECUTAR_rotas.csv</code> e aparece aqui. {data.routes.length} entradas · {groups.length} grupos · {stats.pub} públicas · {stats.adm} administrativas.</p></div></header>
			<div className="cms-toolbar">
				<TextField label="Base dos QRs" value={settings?.qrBase || ''} onChange={e => setSettings(s => ({ ...s, qrBase: e.target.value }))} />
				<TextField label="Buscar" placeholder="título, caminho ou ID" value={q} onChange={e => setQ(e.target.value)} />
			</div>
			<div className="cms-chips">
				<SegmentedControl name="grupo" value={group} onChange={setGroup} ariaLabel="Grupo" options={[{ value: 'todos', label: 'Todos' }, ...groups.map(g => ({ value: g, label: g }))]} />
			</div>
			<div className="cms-routes">
				{shown.map(r => {
					const url = base + previewPath(r.url);
					return (
						<RouteCard key={r.id} group={r.group} title={r.title} path={r.url} url={url} access={r.access} note={r.note || `${r.type} · ${r.template}`} qr={<Qr text={url} />}
							actions={<>
								<Button size="sm" href={previewPath(r.url)} target="_blank">Abrir</Button>
								<Button size="sm" variant="secondary" onClick={() => copy(url)}>{copied === url ? 'Copiado' : 'Copiar URL'}</Button>
							</>} />
					);
				})}
			</div>
		</div>
	);
}
