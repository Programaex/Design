import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { attachArticle, buildCompleteness, parseCsv, parseEcoBlueprints, parseMdx, parseRoutes } from '../lib/content.mjs';
import { score } from '../lib/score.mjs';

const here = new URL('..', import.meta.url);
const read = p => readFileSync(new URL(p, here), 'utf8');

test('parseCsv lida com aspas, vírgulas e linhas em branco', () => {
	assert.deepEqual(parseCsv('a,b\n"x, y","z ""q"""\n\n1,2\n'), [{ a: 'x, y', b: 'z "q"' }, { a: '1', b: '2' }]);
});

test('as 78 rotas do CSV são lidas', () => {
	const routes = parseRoutes(read('../../EXECUTAR_Claude_Design/EXECUTAR_rotas.csv'));
	assert.equal(routes.length, 78);
	assert.equal(routes.find(r => r.id === 'blog').url, '/blog');
});

test('parseMdx extrai frontmatter, painéis, diagramas e fontes do A01', () => {
	const a = parseMdx(read('content/articles/tarefa-decolagem-voo-aterrissagem.mdx'));
	assert.equal(a.slug, 'tarefa-decolagem-voo-aterrissagem');
	assert.deepEqual(a.tags.slice(0, 2), ['TDAH', 'funções executivas']);
	const kinds = a.segments.filter(s => s.t !== 'html').map(s => s.id);
	assert.deepEqual(kinds, ['FLOW-A01-001', 'EX-A01-001', 'PROC-A01-001', 'SRC-A01-001']);
	assert.equal(a.sources.length, 6);
	assert.ok(a.segments.some(s => s.t === 'html' && s.html.includes('<table>')));
	assert.ok(!a.segments.some(s => s.t === 'html' && /<h1|import /.test(s.html)));
});

test('attachArticle insere a figura após a seção indicada', () => {
	const a = attachArticle(parseMdx(read('content/articles/manifesto.mdx')), { id: 'MAN', figure: { after: 'O que esperamos de você', src: 'x.svg' } });
	const i = a.segments.findIndex(s => s.t === 'figure');
	assert.equal(a.segments[i - 1].heading, 'O que esperamos de você');
});

test('completude começa em 0% e sobe por micro', () => {
	const routes = parseRoutes(read('../../EXECUTAR_Claude_Design/EXECUTAR_rotas.csv'));
	const macros = buildCompleteness(routes, parseEcoBlueprints(read('../../packages/design-system/ui_kits/ecossistema/blueprints.js')));
	assert.ok(macros.flatMap(m => m.mesos).every(s => s.micros.length > 0));
	const zero = score(macros, {});
	assert.equal(zero.pct, 0);
	const first = macros[0].mesos[0].micros[0].id;
	const one = score(macros, { [first]: true });
	assert.equal(one.done, 1);
	assert.ok(one.pct > 0 && one.macros[0].mesos[0].pct > 0);
});
