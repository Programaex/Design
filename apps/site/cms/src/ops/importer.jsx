// Importação AlsoAsked (FR-01/02/03/18): upload → parse → validar → preview com erros por registro/campo →
// confirmar lote (transacional por arquivo) → desfazer lote. Reimportação idêntica é reconhecida pelo hash.
import React from 'react';
import { Button, Table, Tag } from '../ds.js';
import { diffDatasets, LIMITS, parseAlsoAsked } from '../../../lib/ops/alsoasked.mjs';
import { importDataset, undoBatch } from '../../../lib/ops/model.mjs';
import { useOps } from './store.jsx';

export function Importer({ doc }) {
	const { apply } = useOps();
	const [items, setItems] = React.useState([]);
	const [done, setDone] = React.useState([]);
	const onFiles = async files => {
		const out = [];
		for (const f of files) {
			if (f.size > LIMITS.bytes) { out.push({ name: f.name, parsed: { errors: [{ record: null, field: null, message: `Arquivo de ${f.size} bytes excede ${LIMITS.bytes}.` }], warnings: [], nodes: [], edges: [] } }); continue; }
			const buf = await f.arrayBuffer();
			let text;
			try { text = new TextDecoder('utf-8', { fatal: true }).decode(buf); }
			catch { out.push({ name: f.name, parsed: { errors: [{ record: null, field: null, message: 'Arquivo não está em UTF-8. Converta para UTF-8 (com ou sem BOM) e envie de novo.' }], warnings: [], nodes: [], edges: [] } }); continue; }
			const parsed = await parseAlsoAsked(text, f.name);
			const dup = parsed.dataset && doc.datasets.find(d => d.sha256 === parsed.dataset.sha256);
			const prev = parsed.dataset && !dup && doc.datasets.filter(d => d.id === parsed.dataset.id || d.baseId === parsed.dataset.id).at(-1);
			out.push({ name: f.name, parsed, dup, diff: prev ? diffDatasets(doc.nodes.filter(n => n.datasetId === prev.id), parsed.nodes) : null, prev });
		}
		setItems(out);
	};
	const confirm = it => {
		const r = apply(d => importDataset(d, it.parsed));
		if (r && !r.error) { setDone(x => [...x, `${it.name}: ${r.status === 'duplicate' ? 'já importado (sem duplicar)' : r.status === 'new-version' ? 'nova versão ' + r.datasetId : 'importado como ' + r.datasetId}`]); setItems(x => x.filter(y => y !== it)); }
	};
	return (
		<div className="ops-import">
			<section className="cms-panel">
				<h2>Importar CSV AlsoAsked</h2>
				<p className="text-muted ops-small">UTF-8 com ou sem BOM. Até {LIMITS.records} registros e 5 MB por arquivo. Respostas multilinha e aspas são aceitas. "Upgrade to Lite/Pro to unlock" é marcado como bloqueado, nunca usado como resposta.</p>
				<label className="btn btn-primary ops-file">Escolher arquivos<input type="file" accept=".csv,text/csv" multiple onChange={e => onFiles([...e.target.files])} /></label>
			</section>
			{done.length > 0 && <div className="ops-notice is-success" role="status">{done.map(d => <div key={d}>{d}</div>)}</div>}
			{items.map(it => {
				const p = it.parsed;
				const ok = !p.errors.length;
				return (
					<section key={it.name} className="cms-panel">
						<h2>{it.name} {ok ? <Tag tone="success">válido</Tag> : <Tag tone="danger">{p.errors.length} erro(s)</Tag>} {it.dup && <Tag tone="warning">já importado ({it.dup.id})</Tag>} {it.prev && <Tag tone="accent">nova versão de {it.prev.id}</Tag>}</h2>
						{ok && <p>{p.dataset.id} · raiz "{p.dataset.name}" · {p.nodes.length} nós · {p.edges.length} relações · {p.dataset.locked} com campos bloqueados · sha256 <code>{p.dataset.sha256.slice(0, 12)}…</code></p>}
						{it.diff && <p className="ops-small">Diff contra {it.prev.id}: +{it.diff.added.length} · −{it.diff.removed.length} · {it.diff.changed.length} alterados.</p>}
						{p.errors.length > 0 && <Table columns={[{ key: 'record', label: 'Registro', render: e => e.record ?? '—' }, { key: 'field', label: 'Campo', render: e => e.field ?? '—' }, { key: 'message', label: 'Problema' }]} rows={p.errors.map((e, i) => ({ ...e, id: i }))} />}
						{p.warnings.length > 0 && <ul className="ops-small">{p.warnings.map((w, i) => <li key={i}>{w.message} ({w.field})</li>)}</ul>}
						{ok && (
							<details><summary>Preview ({Math.min(p.nodes.length, 12)} de {p.nodes.length})</summary>
								<Table columns={[{ key: 'id', label: 'ID', render: n => <code>{n.id}</code> }, { key: 'pos', label: 'Posição', render: n => `(${n.tier1},${n.tier2})` }, { key: 'title', label: 'Pergunta' }, { key: 'answerStatus', label: 'Resposta' }]} rows={p.nodes.slice(0, 12)} />
							</details>
						)}
						<div className="cms-actions"><Button disabled={!ok} onClick={() => confirm(it)}>{it.dup ? 'Confirmar (sem duplicar)' : 'Confirmar lote'}</Button><Button variant="ghost" onClick={() => setItems(x => x.filter(y => y !== it))}>Descartar</Button></div>
					</section>
				);
			})}
			<section className="cms-panel">
				<h2>Lotes</h2>
				<Table columns={[
					{ key: 'id', label: 'Lote', render: b => <code>{b.id}</code> }, { key: 'datasetId', label: 'Dataset' }, { key: 'n', label: 'Nós', render: b => b.nodeIds.length },
					{ key: 'createdAt', label: 'Quando', render: b => (b.createdAt && b.createdAt !== 'seed' ? new Date(b.createdAt).toLocaleString('pt-BR') : 'seed') },
					{ key: 'undo', label: '', render: b => (b.undoneAt ? <Tag>desfeito</Tag> : <Button size="sm" variant="ghost" onClick={() => apply(d => undoBatch(d, b.id))}>Desfazer lote</Button>) },
				]} rows={doc.batches} />
			</section>
		</div>
	);
}
