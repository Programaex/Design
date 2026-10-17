// Embute em .inline/assets.json só o que o painel usa de dist/, para o Worker servir a interface sozinho.
// Usado por `npm run deploy:inline` quando o endpoint de upload de assets do Workers não responde
// (ex.: atrás de um proxy que injeta credencial: o JWT da sessão de upload é sobrescrito e volta 401).
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = 'dist';
const TYPES = {
	'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
	'.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.ico': 'image/x-icon',
};
// Do design system, só os tokens, o CSS dos componentes e o logotipo da tela de login.
const KEEP = [/^\/(index|login|404)\.html$/, /^\/styles\.css$/, /^\/tokens\//, /^\/components\/components\.css$/, /^\/app\//, /^\/data\//, /^\/assets\/brand\/svg\/01_stack_check\.svg$/];

const out = {};
const walk = dir => {
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) { walk(full); continue; }
		const key = '/' + relative(root, full).split('\\').join('/');
		if (KEEP.some(re => re.test(key))) out[key] = { type: TYPES[extname(name)] ?? 'application/octet-stream', body: readFileSync(full).toString('base64') };
	}
};
walk(root);
mkdirSync('.inline', { recursive: true });
writeFileSync('.inline/assets.json', JSON.stringify(out));
const kb = Math.round(JSON.stringify(out).length / 1024);
console.log(`Embedded ${Object.keys(out).length} assets (${kb} KB)`);
if (kb > 2500) throw new Error('Assets embutidos acima de 2,5 MB: revise a lista KEEP.');
