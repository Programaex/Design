// Builds the unified static site from packages/design-system (imported from Claude Design).
// Output layout mirrors the design-system tree so the ui_kits' relative paths (../../styles.css,
// ../../assets/...) keep working unchanged:
//   dist/index.html             hub linking both experiences
//   dist/ui_kits/site/          Risco Cognitivo click-through site
//   dist/ui_kits/ecossistema/   Ecossistema EXECUTAR (78 hash routes, e.g. #/apps)
//   dist/_ds_bundle.js          components compiled from components/**/*.jsx
import { build } from 'esbuild';
import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ds = join(here, '../../packages/design-system');
const out = join(here, 'dist');
const GLOBAL = 'RiscoCognitivoDesignSystem_fab0ba';

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const p of ['styles.css', 'tokens', 'components/components.css', 'assets', 'ui_kits']) {
  await cp(join(ds, p), join(out, p), { recursive: true });
}

// Bundle every component into window[GLOBAL], with React taken from the page's UMD global.
const jsx = [];
for (const group of await readdir(join(ds, 'components'), { withFileTypes: true })) {
  if (!group.isDirectory()) continue;
  for (const f of await readdir(join(ds, 'components', group.name))) {
    if (f.endsWith('.jsx')) jsx.push(join(ds, 'components', group.name, f));
  }
}
const entry = jsx.map(f => `export * from ${JSON.stringify('./' + relative(ds, f))};`).join('\n');
await build({
  stdin: { contents: entry, resolveDir: ds, loader: 'js' },
  bundle: true,
  format: 'iife',
  globalName: GLOBAL,
  loader: { '.jsx': 'jsx' },
  minify: true,
  outfile: join(out, '_ds_bundle.js'),
  plugins: [{
    name: 'react-global',
    setup(b) {
      b.onResolve({ filter: /^react$/ }, () => ({ path: 'react', namespace: 'react-global' }));
      b.onLoad({ filter: /.*/, namespace: 'react-global' }, () => ({ contents: 'module.exports = window.React;', loader: 'js' }));
    },
  }],
});

await writeFile(join(out, 'index.html'), `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Risco Cognitivo · EXECUTAR</title>
<link rel="stylesheet" href="styles.css"></head><body>
<main style="max-width:720px;margin:0 auto;padding:var(--space-16, 64px) var(--space-4, 16px);text-align:center">
<h1>Risco Cognitivo · EXECUTAR</h1>
<p><a class="btn btn-primary" href="ui_kits/site/">Site Risco Cognitivo</a></p>
<p><a class="btn btn-secondary" href="ui_kits/ecossistema/">Ecossistema EXECUTAR</a></p>
<p><a href="ui_kits/ecossistema/#/apps">Apps</a></p>
</main></body></html>
`);
await writeFile(join(out, '404.html'), '<!doctype html><meta charset="utf-8"><title>404</title><p>Página não encontrada. <a href="/">Início</a></p>\n');
console.log('built', relative(process.cwd(), out));
