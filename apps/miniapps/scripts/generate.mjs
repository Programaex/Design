#!/usr/bin/env node
// Regenera, a partir de catalog.json, as páginas de entrada (index.html, <slug>/index.html) e os ícones SVG.
// Os PNG (192, 512, maskable) saem de `node scripts/generate.mjs --png` com Playwright: rode quando um ícone mudar.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = join(dirname(fileURLToPath(import.meta.url)), '..');
const { apps } = JSON.parse(await readFile(join(here, 'catalog.json'), 'utf8'));
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const MONO = { prisma: 'P', executar: 'E', mapa: 'M', rotinas: 'R', 'folhas-a4': 'A4', 'importar-csv': 'CSV' };

const page = ({ title, description, manifest, icon, entry }) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#ffffff">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
${manifest ? `<link rel="manifest" href="${manifest}">\n` : ''}<link rel="icon" href="${icon}.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${icon}-192.png">
</head>
<body>
<div id="root"></div>
<script type="module" src="${entry}"></script>
</body>
</html>
`;

for (const a of apps) {
	await mkdir(join(here, a.slug), { recursive: true });
	await writeFile(join(here, a.slug, 'index.html'), page({ title: a.name + ' · EXECUTAR', description: a.description, manifest: '/m/' + a.slug + '/manifest.webmanifest', icon: '/m/icons/' + a.slug, entry: '/src/apps/' + a.slug + '.tsx' }));
}
await writeFile(join(here, 'index.html'), page({ title: 'Mini apps · EXECUTAR', description: 'Prisma, Executar, Mapa mental, Rotinas, Folhas A4 e Importar CSV: apps locais, offline e sem conta.', manifest: null, icon: '/m/icons/prisma', entry: '/src/apps/hub.tsx' }));

const svg = (a, pad) => {
	const m = MONO[a.slug] || a.title[0], size = m.length > 2 ? 150 : m.length > 1 ? 190 : 260;
	const r = pad ? 0 : 112;
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="${r}" fill="${a.color}"/>` +
		`<text x="256" y="${256 + size * 0.36}" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display',Inter,Helvetica,Arial,sans-serif" font-weight="600" font-size="${size}" letter-spacing="-4" fill="#ffffff">${m}</text></svg>\n`;
};
await mkdir(join(here, 'public/icons'), { recursive: true });
for (const a of apps) await writeFile(join(here, 'public/icons', a.slug + '.svg'), svg(a, false));

if (process.argv.includes('--png')) {
	const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
	const browser = await chromium.launch();
	const p = await browser.newPage();
	for (const a of apps) {
		for (const [name, px, pad] of [['-192', 192, false], ['-512', 512, false], ['-maskable', 512, true]]) {
			await p.setViewportSize({ width: px, height: px });
			await p.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${px}px;height:${px}px}</style>${svg(a, pad)}`);
			await p.screenshot({ path: join(here, 'public/icons', a.slug + name + '.png'), omitBackground: !pad });
		}
	}
	await browser.close();
}
console.log('ok:', apps.length, 'apps');
