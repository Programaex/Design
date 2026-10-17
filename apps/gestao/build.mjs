// Build do Worker "gestao": painel dos épicos sobre o mesmo pacote de tokens do CMS.
//   dist/index.html, dist/login.html   páginas (o Worker exige sessão para index)
//   dist/app/app.js|login.js|app.css   app React pré-compilado
//   dist/data/epicos-N.json             snapshot mesclado de cada épico (fallback sem API)
//   dist/data/solo-campaign.json        modelo do PDF "Solo Campaign System"
//   dist/data/qr.json                   QR (SVG) da issue de cada épico no GitHub
import { build } from 'esbuild';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import { mergeEpic } from './lib/merge.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '../..');
const ds = join(root, 'packages/design-system');
const out = join(here, 'dist');
const require = createRequire(import.meta.url);

await rm(out, { recursive: true, force: true });
await mkdir(join(out, 'data'), { recursive: true });
for (const p of ['styles.css', 'tokens', 'components/components.css', 'assets']) await cp(join(ds, p), join(out, p), { recursive: true });

// ---------- dados ----------
const snapshot = JSON.parse(await readFile(join(here, 'data/snapshot.json'), 'utf8'));
const qr = {};
for (const [n, e] of Object.entries(snapshot.epics)) {
	const merged = mergeEpic(e, null);
	await writeFile(join(out, `data/epicos-${n}.json`), JSON.stringify({ ...merged, fetchedAt: null, snapshotAt: snapshot.generatedAt, snapshotSource: snapshot.source }));
	qr[n] = await QRCode.toString(e.epic.url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M' });
}
await writeFile(join(out, 'data/qr.json'), JSON.stringify(qr));
await cp(join(here, 'data/solo-campaign.json'), join(out, 'data/solo-campaign.json'));

// ---------- app e login (React do npm, pré-compilado) ----------
await build({
	entryPoints: { app: join(here, 'src/main.jsx'), login: join(here, 'src/login.jsx') },
	bundle: true, format: 'esm', minify: true, outdir: join(out, 'app'), loader: { '.jsx': 'jsx' },
	define: { 'process.env.NODE_ENV': '"production"' },
	// Uma única cópia do React 18, inclusive para os componentes importados de packages/design-system.
	alias: { react: dirname(require.resolve('react/package.json')), 'react-dom': dirname(require.resolve('react-dom/package.json')) },
});
await cp(join(here, 'src/app.css'), join(out, 'app/app.css'));

// Caminhos relativos: a mesma página abre pelo Worker (/) e como arquivo local (gerador de PDF).
const shell = (title, script) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
<link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="app/app.css"><script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script></head>
<body><div id="root"></div><script type="module" src="app/${script}.js"></script></body></html>
`;
await writeFile(join(out, 'index.html'), shell('Gestão · EXECUTAR', 'app'));
await writeFile(join(out, 'login.html'), shell('Entrar · Gestão EXECUTAR', 'login'));
await writeFile(join(out, '404.html'), '<!doctype html><meta charset="utf-8"><title>404</title><link rel="stylesheet" href="/styles.css"><p style="padding:24px">Página não encontrada. <a href="/">Voltar ao painel</a></p>\n');
console.log(`built dist · épicos ${Object.entries(snapshot.epics).map(([n, e]) => `#${n} (${e.items.length})`).join(', ')} · snapshot ${snapshot.generatedAt.slice(0, 10)}`);
