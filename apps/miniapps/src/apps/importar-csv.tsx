// Importar CSV: CSV #3 do plano-operacional-rastreavel → plano do Prisma, com prévia antes de substituir o plano atual.
import * as C from '@executar/core';
import { Button, Icon, Tag } from '@executar/ui';
import { useRef, useState } from 'react';
import { MiniApp } from '../shell/MiniApp';
import { useMiniApp } from '../shell/store';
import { mount } from './mount';

const EXAMPLE = [
	'tarefa_id;cluster_id;cluster_nome;titulo;prioridade;prazo;evidencia_conclusao',
	'T-001;C-01;Site publicado;Revisar título, proposta de valor e CTA;Alta;;Página no ar com URL verificada',
	'T-002;C-01;Site publicado;Testar três envios do formulário;Alta;;',
	'T-003;C-02;Campanha de e-mail;Montar a lista de contatos;Média;;Lista com 200 contatos revisados',
	'T-004;C-02;Campanha de e-mail;Escrever e agendar o primeiro envio;Média;;',
	'T-005;C-03;Relatório do mês;Consolidar os números da campanha;Baixa;;Relatório enviado ao time'
].join('\n');

function ImportarCsv() {
	const app = useMiniApp();
	const { s, a } = app;
	const [text, setText] = useState('');
	const [nome, setNome] = useState('Plano operacional');
	const [done, setDone] = useState(false);
	const file = useRef<HTMLInputElement>(null);
	let preview: ReturnType<typeof C.planFromCsv> | null = null, error = '';
	if (text.trim()) { try { preview = C.planFromCsv(text, nome.trim() || 'Plano operacional'); } catch (e) { error = e instanceof Error ? e.message : 'CSV inválido'; } }
	const pick = async (ev: React.ChangeEvent<HTMLInputElement>) => {
		const f = ev.target.files?.[0]; ev.target.value = ''; if (!f) return;
		setText(await f.text()); setNome(f.name.replace(/\.csv$/i, '')); setDone(false);
	};
	const use = () => {
		if (!preview) return;
		if (s.plan && !window.confirm('Substituir o plano "' + s.plan.nome + '" deste aparelho pelo plano do CSV?')) return;
		a.importPlan(preview); setDone(true);
	};
	return (
		<MiniApp slug="importar-csv" app={app}>
			<div className="px-4 pt-4 pb-10">
				<h1 className="m-0 text-[28px] leading-[1.14] font-semibold tracking-[-0.01em]">Plano a partir do CSV.</h1>
				<p className="mt-2 mb-5 text-[15px] leading-[1.47] text-text-muted">Use o CSV do plano operacional rastreável. Cada cluster vira um entregável; a prioridade define o horizonte (Alta → Agora, Média → Próximo, Baixa → Depois) e a evidência de conclusão vira a prova.</p>
				<div className="flex flex-wrap gap-2">
					<Button onClick={() => file.current?.click()} icon={<i className="ph ph-file-arrow-up" aria-hidden />}>Escolher arquivo</Button>
					<Button variant="secondary" onClick={() => { setText(EXAMPLE); setNome('Exemplo operacional'); setDone(false); }}>Usar exemplo</Button>
				</div>
				<input ref={file} type="file" accept=".csv,text/csv" className="hidden" onChange={pick} aria-hidden tabIndex={-1} />
				<label className="mt-5 block">
					<span className="mb-1.5 block text-[12px] text-text-muted">Ou cole o CSV (separado por ; ou ,)</span>
					<textarea className="input min-h-[140px] font-[family-name:var(--font-mono-doc)] text-[12px]" value={text} onChange={e => { setText(e.target.value); setDone(false); }} placeholder="tarefa_id;cluster_id;cluster_nome;titulo;prioridade;…" spellCheck={false} />
				</label>
				<label className="mt-3 block">
					<span className="mb-1.5 block text-[12px] text-text-muted">Nome do plano</span>
					<input className="input" value={nome} maxLength={120} onChange={e => setNome(e.target.value)} />
				</label>
				{error && <div role="alert" className="mt-4 flex items-center gap-2 text-[14px] text-danger"><Icon name="warning" />{error}</div>}
				{preview && (
					<section aria-label="Prévia" className="mt-6">
						<div className="text-[12px] font-semibold text-text-muted">Prévia · {preview.plan.ents.length} entregáveis · {preview.plan.ents.reduce((n, e) => n + e.tarefas.length, 0)} tarefas · {preview.plan.periodo} dias</div>
						<div className="mt-2 flex flex-col gap-2">
							{preview.plan.ents.map(e => (
								<div key={e.id} className="rounded-lg bg-surface px-4 py-3">
									<div className="flex items-center gap-2"><Tag tone={(['accent', 'warning', 'neutral'] as const)[e.hz]}>{C.HZ[e.hz].nome}</Tag><span className="text-[17px] font-semibold">{e.titulo}</span></div>
									<ul className="mt-2 mb-0 flex list-none flex-col gap-1 p-0 text-[14px]">{e.tarefas.map(t => <li key={t.id}><span className="font-[family-name:var(--font-mono-doc)] text-[11px] text-text-muted">{t.ref}</span> {C.taskText(t, 'p')}</li>)}</ul>
									<div className="mt-2 text-[12px] text-text-muted">Prova: {e.prova.p}</div>
								</div>
							))}
						</div>
						{done ? (
							<div role="status" className="mt-4 rounded-lg bg-surface p-4 text-[15px]">Plano importado. <a href="/m/prisma/">Abrir no Prisma</a> · <a href="/m/executar/">Executar agora</a></div>
						) : <div className="mt-4"><Button block onClick={use}>Usar este plano</Button></div>}
					</section>
				)}
			</div>
		</MiniApp>
	);
}
mount(<ImportarCsv />);
