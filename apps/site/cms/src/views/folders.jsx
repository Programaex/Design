// Home de pastas (taxonomia EXEC-INFO-DOMAIN-001: D01–D16 + SRC-FOLDER-001) e visualizador de documentos.
import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Button, FolderCard, Table, Tag, TextField } from '../ds.js';
import { go } from '../store.js';
import { parseCsv } from '../../../lib/content.mjs';

const ICON = { md: 'ph-file-text', mdx: 'ph-file-code', csv: 'ph-table', json: 'ph-brackets-curly', svg: 'ph-file-svg', png: 'ph-image', jpg: 'ph-image', jpeg: 'ph-image', pdf: 'ph-file-pdf' };
const KIND = { md: 'Documento', mdx: 'Artigo', csv: 'Planilha', json: 'Dados', svg: 'Vetor', png: 'Imagem', jpg: 'Imagem', jpeg: 'Imagem', pdf: 'PDF' };

export function Folders({ data, folder }) {
	const byFolder = React.useMemo(() => data.docs.reduce((m, d) => ((m[d.folder] ||= []).push(d), m), {}), [data]);
	if (folder) {
		const f = data.folders.find(x => x.id === folder);
		const files = byFolder[folder] || [];
		return (
			<div className="cms-page">
				<header className="cms-head">
					<div><a className="cms-back" href="#/pastas">‹ Pastas</a><span className="cms-kicker">{f?.id}</span><h1>{f?.title}</h1><p className="text-muted"><code>{f?.slug}</code> · fonte {f?.source}</p></div>
				</header>
				{files.length ? (
					<Table columns={[
						{ key: 'name', label: 'Arquivo', render: d => <a href={'#/docs/' + encodeURIComponent(d.path)}><i className={'ph ' + (ICON[d.ext] || 'ph-file')} /> {d.name}</a> },
						{ key: 'ext', label: 'Tipo', render: d => <Tag>{KIND[d.ext] || d.ext}</Tag> },
						{ key: 'path', label: 'Caminho no repositório', muted: true, render: d => <code>{d.path}</code> },
						{ key: 'github', label: 'GitHub', render: d => <a href={d.github} target="_blank" rel="noreferrer">Abrir ↗</a> },
					]} rows={files.map(d => ({ ...d, id: d.path }))} />
				) : <div className="cms-empty"><i className="ph ph-folder-dashed" /><p>Nenhum documento ligado a esta pasta ainda.</p><p className="text-muted">Inclua uma regra em <code>apps/site/cms/data/folder-map.json</code>.</p></div>}
				{f?.notes && <p className="text-muted cms-note">{f.notes}</p>}
			</div>
		);
	}
	return (
		<div className="cms-page">
			<header className="cms-head"><div><span className="cms-kicker">EXEC-INFO-DOMAIN-001 · Mapa das áreas</span><h1>Pastas e documentos</h1><p className="text-muted">{data.folders.length} pastas com IDs preservados · {data.docs.length} arquivos do repositório ligados às áreas</p></div>
				<Button variant="secondary" size="sm" onClick={() => go('docs/' + encodeURIComponent('docs/taxonomia/EXECUTAR_mapa_A4.svg'))}>Ver mapa A4</Button></header>
			<div className="cms-folders">
				{data.folders.map(f => <FolderCard key={f.id} id={f.id} title={f.title} slug={f.slug} count={(byFolder[f.id] || []).length} status={(byFolder[f.id] || []).length ? 'existing' : 'empty'} onClick={() => go('pastas/' + f.id)} />)}
			</div>
		</div>
	);
}

function CsvView({ text }) {
	const [q, setQ] = React.useState('');
	const rows = React.useMemo(() => parseCsv(text), [text]);
	const cols = rows.length ? Object.keys(rows[0]) : [];
	const shown = q ? rows.filter(r => Object.values(r).join(' ').toLowerCase().includes(q.toLowerCase())) : rows;
	return (
		<>
			<div className="cms-toolbar"><TextField placeholder="Filtrar linhas…" value={q} onChange={e => setQ(e.target.value)} aria-label="Filtrar" /><span className="text-muted">{shown.length} de {rows.length} linhas · {cols.length} colunas</span></div>
			<div className="cms-scroll-x"><Table columns={cols.map(c => ({ key: c, label: c }))} rows={shown.map((r, i) => ({ ...r, id: i }))} /></div>
		</>
	);
}

export function DocView({ data, path }) {
	const doc = data.docs.find(d => d.path === path);
	const [text, setText] = React.useState(null);
	const src = '/files/' + path.split('/').map(encodeURIComponent).join('/');
	const textual = doc && ['md', 'mdx', 'csv', 'json'].includes(doc.ext);
	React.useEffect(() => { if (textual) fetch(src).then(r => r.text()).then(setText); }, [src, textual]);
	if (!doc) return <div className="cms-page"><p>Documento não encontrado: <code>{path}</code></p></div>;
	const folder = data.folders.find(f => f.id === doc.folder);
	let body;
	if (doc.ext === 'md' || doc.ext === 'mdx') body = text == null ? null : <article className="cms-doc" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(text.replace(/^---\n[\s\S]*?\n---\n/, ''), { gfm: true })) }} />;
	else if (doc.ext === 'csv') body = text == null ? null : <CsvView text={text} />;
	else if (doc.ext === 'json') body = text == null ? null : <pre className="cms-pre">{JSON.stringify(JSON.parse(text), null, 2)}</pre>;
	else if (doc.ext === 'pdf') body = <iframe className="cms-pdf" src={src} title={doc.name} />;
	else body = <figure className="cms-img"><img src={src} alt={doc.name} /></figure>;
	return (
		<div className="cms-page">
			<header className="cms-head">
				<div><a className="cms-back" href={'#/pastas/' + doc.folder}>‹ {folder ? `${folder.id} · ${folder.title}` : 'Pastas'}</a><span className="cms-kicker">{KIND[doc.ext] || doc.ext}</span><h1>{doc.name}</h1><p className="text-muted"><code>{doc.path}</code></p></div>
				<div className="cms-actions"><Button variant="secondary" size="sm" href={src} target="_blank">Arquivo bruto</Button><Button size="sm" href={doc.github} target="_blank">Ver no GitHub ↗</Button></div>
			</header>
			{body || <p className="text-muted">Carregando…</p>}
		</div>
	);
}
