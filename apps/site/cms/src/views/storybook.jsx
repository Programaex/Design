// Storybook do pacote de design system: todos os componentes e variantes em lorem ipsum.
import React from 'react';
import { ArticleHeader, AsciiDiagram, Button, Card, Dialog, FolderCard, KanbanCard, NavBar, PlainTextPanel, ProgressRing, PromoTile, RadioGroup, RouteCard, SegmentedControl, Table, Tag, TextField } from '../ds.js';

const L = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
const QR = () => <svg viewBox="0 0 8 8" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6, 7].flatMap(y => [0, 1, 2, 3, 4, 5, 6, 7].map(x => ((x * 7 + y * 3) % 5 < 2 ? <rect key={x + '-' + y} x={x} y={y} width="1" height="1" fill="currentColor" /> : null)))}</svg>;

function DialogDemo() {
	const [open, setOpen] = React.useState(false);
	return (
		<div className="sb-dialog-stage">
			<Button onClick={() => setOpen(true)}>Abrir diálogo</Button>
			<Dialog contained open={open} title="Lorem ipsum" onClose={() => setOpen(false)} actions={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={() => setOpen(false)}>Confirmar</Button></>}>{L}</Dialog>
		</div>
	);
}

const STORIES = [
	{ name: 'Button', group: 'Ações', variants: [
		['Primário · secundário · ghost', <><Button>Lorem ipsum</Button><Button variant="secondary">Dolor sit</Button><Button variant="ghost">Amet</Button></>],
		['Pequeno, com ícone, desabilitado', <><Button size="sm" icon={<i className="ph ph-plus" />}>Lorem</Button><Button size="sm" variant="secondary" iconAfter={<i className="ph ph-arrow-right" />}>Ipsum</Button><Button disabled>Desabilitado</Button></>],
	] },
	{ name: 'Tag', group: 'Ações', variants: [['Tons', <><Tag>Neutro</Tag><Tag tone="accent">Lorem</Tag><Tag tone="success">Ipsum</Tag><Tag tone="warning">Dolor</Tag><Tag tone="danger">Amet</Tag></>]] },
	{ name: 'Table', group: 'Dados', variants: [['Tabela simples', <Table columns={[{ key: 'id', label: 'ID' }, { key: 't', label: 'Título' }, { key: 's', label: 'Status', render: r => <Tag tone="accent">{r.s}</Tag> }]} rows={[1, 2, 3].map(k => ({ id: 'LOR-00' + k, t: 'Lorem ipsum dolor ' + k, s: ['CAPTURADO', 'QA', 'PUBLICADO'][k - 1] }))} />]] },
	{ name: 'ProgressRing', group: 'Dados', variants: [['0 · 42 · 100', <><ProgressRing value={0} label="Zero" /><ProgressRing value={42} label="Parcial" /><ProgressRing value={100} label="Completo" /></>]] },
	{ name: 'KanbanCard', group: 'Dados', variants: [['Em andamento e concluído', <><KanbanCard id="LOR:Hero" context="Lorem" title="Lorem ipsum: substituir capa" /><KanbanCard id="LOR:Rich" context="Ipsum" tone="success" title="Dolor sit amet" done /></>]] },
	{ name: 'TextField', group: 'Formulários', variants: [['Linha e multilinha', <><TextField label="Lorem ipsum" placeholder="Dolor sit amet" /><TextField label="Mensagem" multiline rows={3} placeholder={L} /></>]] },
	{ name: 'RadioGroup', group: 'Formulários', variants: [['Opções', <RadioGroup name="sb-radio" label="Lorem ipsum" options={[{ value: 'a', label: 'Lorem' }, { value: 'b', label: 'Ipsum' }, { value: 'c', label: 'Dolor' }]} />]] },
	{ name: 'SegmentedControl', group: 'Formulários', variants: [['Três opções', <SegmentedControl name="sb-seg" ariaLabel="Lorem" options={[{ value: 'a', label: 'Lorem' }, { value: 'b', label: 'Ipsum' }, { value: 'c', label: 'Dolor' }]} />]] },
	{ name: 'NavBar', group: 'Navegação', variants: [['Com ação', <NavBar brand="Lorem ipsum" logoSrc="/assets/brand/svg/02_brain.svg" links={[{ label: 'Lorem', current: true }, { label: 'Ipsum' }, { label: 'Dolor' }]} action={<Button size="sm">Amet</Button>} />]] },
	{ name: 'RouteCard', group: 'Navegação', variants: [['Pública e admin', <><RouteCard group="Lorem" title="Lorem ipsum" path="/lorem" url="https://lorem.workers.dev/lorem" access="publico" qr={<QR />} actions={<Button size="sm">Abrir</Button>} /><RouteCard group="Admin" title="Dolor sit" path="/admin/dolor" access="administrador" qr={<QR />} /></>]] },
	{ name: 'FolderCard', group: 'Navegação', variants: [['Com e sem arquivos', <><FolderCard id="D01" title="Lorem ipsum" slug="D01_lorem-ipsum" count={3} /><FolderCard id="D02" title="Dolor sit amet" slug="D02_dolor-sit" count={0} status="empty" /></>]] },
	{ name: 'Card', group: 'Superfícies', variants: [['Interativo e elevado', <><Card kicker="Lorem" title="Ipsum dolor" body={L} meta={<><i className="ph ph-clock" />6 min</>} interactive /><Card kicker="Dolor" title="Sit amet" body={L} elevation="md" /></>]] },
	{ name: 'PromoTile', group: 'Superfícies', variants: [['Claro e escuro', <><PromoTile kicker="Lorem" title="Ipsum dolor." body={L} actions={<Button size="sm">Lorem</Button>} /><PromoTile theme="dark" kicker="Dolor" title="Sit amet." body={L} actions={<Button size="sm">Ipsum</Button>} /></>]] },
	{ name: 'Dialog', group: 'Superfícies', variants: [['Modal', <DialogDemo />]] },
	{ name: 'ArticleHeader', group: 'Conteúdo', variants: [['Com tags', <ArticleHeader kicker="Artigo" title="Lorem ipsum dolor sit amet" description={L} tags={['Lorem', 'Ipsum']} meta="6 min de leitura" />]] },
	{ name: 'PlainTextPanel', group: 'Conteúdo', variants: [['Exemplo · procedimento · fontes', <div className="sb-col"><PlainTextPanel id="EX-LOR-001" kind="example" title="Antes e depois">{'ANTES\nLorem ipsum.\n\nDEPOIS\nDolor sit amet, consectetur.'}</PlainTextPanel><PlainTextPanel id="PROC-LOR-001" kind="procedure" title="Lorem ipsum">{'1. Lorem ipsum.\n2. Dolor sit amet.\n3. Consectetur.'}</PlainTextPanel><PlainTextPanel id="SRC-LOR-001" kind="evidence" title="Fontes">{'Lorem (2026). Ipsum dolor. https://exemplo.org'}</PlainTextPanel></div>]] },
	{ name: 'AsciiDiagram', group: 'Conteúdo', variants: [['Fluxo', <AsciiDiagram id="FLOW-LOR-001" title="Lorem ipsum">{'LOREM\n│\n▼\nIPSUM\n│\n▼\nDOLOR'}</AsciiDiagram>]] },
];

export function Storybook({ data }) {
	const [only, setOnly] = React.useState(null);
	const groups = [...new Set(STORIES.map(s => s.group))];
	const missing = data.components.filter(c => !STORIES.some(s => s.name === c));
	return (
		<div className="cms-page sb">
			<header className="cms-head"><div><span className="cms-kicker">packages/design-system</span><h1>Storybook</h1>
				<p className="text-muted">{STORIES.length} componentes do pacote, os mesmos usados pelo site real, todos em lorem ipsum. Novos: ArticleHeader, PlainTextPanel, AsciiDiagram, RouteCard, FolderCard, ProgressRing, KanbanCard.</p>
				{missing.length > 0 && <p><Tag tone="warning">Sem história: {missing.join(', ')}</Tag></p>}</div></header>
			<div className="sb-layout">
				<nav className="sb-index" aria-label="Componentes">
					<button className={!only ? 'is-on' : ''} onClick={() => setOnly(null)}>Todos</button>
					{groups.map(g => <div key={g}><div className="cms-nav-title">{g}</div>{STORIES.filter(s => s.group === g).map(s => <button key={s.name} className={only === s.name ? 'is-on' : ''} onClick={() => setOnly(s.name)}>{s.name}</button>)}</div>)}
				</nav>
				<div className="sb-stories">
					{STORIES.filter(s => !only || s.name === only).map(s => (
						<section key={s.name} className="sb-story" id={'sb-' + s.name}>
							<h2>{s.name} <small className="text-muted">{s.group}</small></h2>
							{s.variants.map(([label, el]) => <div key={label} className="sb-variant"><div className="sb-label">{label}</div><div className="sb-canvas">{el}</div></div>)}
						</section>
					))}
				</div>
			</div>
		</div>
	);
}
