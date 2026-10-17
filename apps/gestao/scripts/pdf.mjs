// Gera os PDFs de uma página (A4 paisagem) das duas views a partir de dist/, com o snapshot embarcado.
// Uso: node scripts/pdf.mjs [--hoje AAAA-MM-DD] [--offline]
//   --offline  bloqueia fontes e ícones externos (ambientes sem acesso à internet)
//   CHROME_PATH aponta para o Chromium/Chrome; sem ele, usa o navegador instalado pelo Playwright.
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { VIEWS } from '../lib/views.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '../dist');
const out = join(here, '../out');
const arg = name => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };
const hoje = arg('--hoje') || new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
const offline = process.argv.includes('--offline');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };

// Servidor estático mínimo: sem /api, o app usa o snapshot embarcado em dist/data.
const server = createServer(async (req, res) => {
	const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
	try {
		const body = await readFile(join(dist, path.endsWith('/') ? path + 'index.html' : path));
		res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' }).end(body);
	} catch {
		res.writeHead(404).end();
	}
});
await new Promise(r => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;

await mkdir(out, { recursive: true });
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
let failed = false;
try {
	for (const view of Object.values(VIEWS)) {
		const page = await browser.newPage({ viewport: { width: 1300, height: 900 } });
		if (offline) await page.route(/unpkg\.com|googleapis\.com|gstatic\.com/, r => r.abort());
		await page.goto(`${base}/index.html?print=1&hoje=${hoje}#/${view.id}`, { waitUntil: 'load' });
		await page.waitForFunction(() => window.__printFit, null, { timeout: 15000 });
		const fit = await page.evaluate(() => window.__printFit);
		if (!fit.legible) {
			console.error(`${view.id}: não cabe legível em A4 (${fit.pt.toFixed(1)} pt < 9 pt); PDF não gerado.`);
			failed = true;
			continue;
		}
		const file = join(out, `gestao-${view.id}-${hoje}.pdf`);
		await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true });
		console.log(`${view.id}: ${file} · menor fonte ${fit.pt.toFixed(1)} pt · escala ${fit.scale.toFixed(3)}`);
		await page.close();
	}
} finally {
	await browser.close();
	server.close();
}
process.exit(failed ? 1 : 0);
