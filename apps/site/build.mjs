// Build do Worker "design": CMS EXECUTAR + kits do Claude Design, todos sobre o mesmo pacote de tokens.
//   dist/index.html            CMS (exige login no Worker)
//   dist/login.html            tela de login
//   dist/cms/app.js|data.json  app do CMS e dados gerados (rotas, pastas, artigos, completude)
//   dist/files/<repo-path>     documentos do repo exibidos no visualizador do CMS
//   dist/ui_kits/...           site real (ecossistema) — o preview do CMS abre estas rotas
//   dist/_ds_bundle.js         componentes de packages/design-system/components
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAlsoAsked } from './lib/ops/alsoasked.mjs';
import { editorialToTasks } from './lib/ops/editorial.mjs';
import { seedDoc } from './lib/ops/model.mjs';
import { assignFolder, attachArticle, buildCompleteness, parseEcoBlueprints, parseFolders, parseMdx, parseRoutes } from './lib/content.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '../..');
const ds = join(root, 'packages/design-system');
const out = join(here, 'dist');
const GLOBAL = 'RiscoCognitivoDesignSystem_fab0ba';
const REPO = 'https://github.com/Programaex/Design';
const read = p => readFile(join(root, p), 'utf8');

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const p of ['styles.css', 'tokens', 'components/components.css', 'assets', 'ui_kits']) await cp(join(ds, p), join(out, p), { recursive: true });

// ---------- componentes do DS (window[GLOBAL]) para os kits ----------
const jsx = [];
for (const group of await readdir(join(ds, 'components'), { withFileTypes: true })) {
	if (!group.isDirectory()) continue;
	for (const f of await readdir(join(ds, 'components', group.name))) if (f.endsWith('.jsx')) jsx.push(join(ds, 'components', group.name, f));
}
const reactGlobal = {
	name: 'react-global',
	setup(b) {
		b.onResolve({ filter: /^react$/ }, () => ({ path: 'react', namespace: 'react-global' }));
		b.onLoad({ filter: /.*/, namespace: 'react-global' }, () => ({ contents: 'module.exports = window.React;', loader: 'js' }));
	},
};
await build({
	stdin: { contents: jsx.map(f => `export * from ${JSON.stringify('./' + relative(ds, f))};`).join('\n'), resolveDir: ds, loader: 'js' },
	bundle: true, format: 'iife', globalName: GLOBAL, loader: { '.jsx': 'jsx' }, minify: true,
	outfile: join(out, '_ds_bundle.js'), plugins: [reactGlobal],
});
const componentNames = jsx.map(f => f.split('/').pop().replace('.jsx', '')).sort();

// ---------- dados ----------
const routes = parseRoutes(await read('EXECUTAR_Claude_Design/EXECUTAR_rotas.csv'));
const blueprints = parseEcoBlueprints(await read('packages/design-system/ui_kits/ecossistema/blueprints.js'));
const folders = parseFolders(await read('docs/taxonomia/MASTER_INDEX.csv'));
const { rules } = JSON.parse(await readFile(join(here, 'cms/data/folder-map.json'), 'utf8'));
const hubModules = JSON.parse(await readFile(join(here, 'cms/data/hub-modules.json'), 'utf8'));
const hubSeed = JSON.parse(await readFile(join(here, 'cms/data/hub-seed.json'), 'utf8'));

// Artigos: MDX + anexos → segmentos prontos para o renderer do ecossistema e para o CMS.
const artDir = join(here, 'content/articles');
const attachments = JSON.parse(await readFile(join(artDir, 'attachments.json'), 'utf8'));
const articles = [];
for (const f of (await readdir(artDir)).filter(f => f.endsWith('.mdx')).sort()) {
	const a = parseMdx(await readFile(join(artDir, f), 'utf8'));
	articles.push({ ...attachArticle(a, attachments[a.slug]), file: `apps/site/content/articles/${f}` });
}
const order = ['tarefa-decolagem-voo-aterrissagem', 'quando-mensagens-disputam-atencao', 'o-que-custa-quando-o-processo-falha', 'manifesto'];
articles.sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
// ---------- mini apps PWA (apps/miniapps) → dist/m/ + itens reais dos catálogos /apps e /ferramentas ----------
execFileSync('npm', ['run', 'build', '-w', 'apps/miniapps'], { cwd: root, stdio: 'inherit' });
await cp(join(root, 'apps/miniapps/dist'), join(out, 'm'), { recursive: true });
const { apps: miniapps } = JSON.parse(await read('apps/miniapps/catalog.json'));
await writeFile(join(out, 'ui_kits/ecossistema/miniapps.js'), `// Gerado por apps/site/build.mjs a partir de apps/miniapps/catalog.json. Não editar.\nwindow.ECO_MINIAPPS = ${JSON.stringify(miniapps.map(a => ({ ...a, href: '/m/' + a.slug + '/', icon: '/m/icons/' + a.slug + '.svg' })))};\n`);

await writeFile(join(out, 'ui_kits/ecossistema/articles.js'), `// Gerado por apps/site/build.mjs a partir de apps/site/content/articles/*.mdx. Não editar.\nwindow.ECO_ARTICLES = ${JSON.stringify(articles)};\n`);

// Documentos do repo (somente arquivos versionados) → pastas da taxonomia.
const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
const docs = [];
for (const path of tracked) {
	const folder = assignFolder(path, rules);
	if (!folder) continue;
	await mkdir(dirname(join(out, 'files', path)), { recursive: true });
	await cp(join(root, path), join(out, 'files', path));
	docs.push({ path, folder, name: path.split('/').pop(), ext: extname(path).slice(1).toLowerCase(), github: `${REPO}/blob/main/${encodeURI(path)}` });
}

// Varredura de pendências (indicador global): lorem e placeholders ainda presentes no site real.
const scan = { lorem: 0, placeholders: 0 };
for (const f of await readdir(join(ds, 'ui_kits/ecossistema'))) {
	if (!/\.(jsx?|css)$/.test(f)) continue;
	const t = await readFile(join(ds, 'ui_kits/ecossistema', f), 'utf8');
	scan.lorem += (t.match(/lorem/gi) || []).length;
	scan.placeholders += (t.match(/placeholders\/|\bPH\[|image-slot/g) || []).length;
}

const data = {
	generatedAt: new Date().toISOString(), repo: REPO, routes, folders, docs, articles, components: componentNames, scan,
	completeness: buildCompleteness(routes, blueprints),
	hub: { modules: hubModules, seed: hubSeed.seed, vocab: hubSeed.vocab },
	adrStates: ['CAPTURADO', 'PRIORIZADO', 'PESQUISA', 'COPY', 'VISUAL', 'QA', 'AGENDADO', 'PUBLICADO', 'MEDIDO', 'RECICLAR'],
};
await mkdir(join(out, 'cms'), { recursive: true });
await writeFile(join(out, 'cms/data.json'), JSON.stringify(data));

// Operações e Dados: seed do documento ops (3 datasets AlsoAsked + 45 registros editoriais).
const opsDir = join(here, 'content/ops');
const opsFiles = (await readdir(opsDir)).filter(f => f.startsWith('DATA-') && f.endsWith('.csv')).sort();
const parsed = await Promise.all(opsFiles.map(async f => parseAlsoAsked(await readFile(join(opsDir, f), 'utf8'), f, { importedAt: 'seed' })));
const bad = parsed.filter(p => p.errors.length);
if (bad.length) throw new Error('Fixtures AlsoAsked inválidos: ' + JSON.stringify(bad.map(b => b.errors)));
const ops = seedDoc(parsed, editorialToTasks(await readFile(join(opsDir, 'editorial_workflow.csv'), 'utf8')));
await writeFile(join(out, 'cms/ops-seed.json'), JSON.stringify(ops));

// ---------- app do CMS e login (React do npm, pré-compilado) ----------
await build({
	entryPoints: { app: join(here, 'cms/src/main.jsx'), login: join(here, 'cms/src/login.jsx') },
	bundle: true, format: 'esm', minify: true, outdir: join(out, 'cms'), loader: { '.jsx': 'jsx' },
	define: { 'process.env.NODE_ENV': '"production"' }, nodePaths: [join(root, 'node_modules')],
	// Uma única cópia do React 18 deste app, inclusive para os componentes importados de packages/design-system.
	alias: { react: join(here, 'node_modules/react'), 'react-dom': join(here, 'node_modules/react-dom') },
});
await cp(join(here, 'cms/cms.css'), join(out, 'cms/cms.css'));

const shell = (title, script) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
<link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/cms/cms.css"><script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script></head>
<body><div id="root"></div><script type="module" src="/cms/${script}.js"></script></body></html>
`;
await writeFile(join(out, 'index.html'), shell('CMS · EXECUTAR', 'app'));
await writeFile(join(out, 'login.html'), shell('Entrar · CMS EXECUTAR', 'login'));
await writeFile(join(out, '404.html'), '<!doctype html><meta charset="utf-8"><title>404</title><link rel="stylesheet" href="/styles.css"><p style="padding:24px">Página não encontrada. <a href="/">Voltar ao CMS</a></p>\n');
console.log(`ops: ${ops.nodes.length} nós · ${ops.edges.length} relações · ${ops.tasks.length} tarefas`);
console.log(`built dist · ${routes.length} rotas · ${docs.length} docs · ${articles.length} artigos · ${miniapps.length} mini apps · ${componentNames.length} componentes`);
