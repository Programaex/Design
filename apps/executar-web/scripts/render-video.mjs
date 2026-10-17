#!/usr/bin/env node
// Renders the promotional video (1920 × 1080, 30 fps, 10.5 s) from /storyboard/render — the same <Diagram> as the
// landing hero, frozen frame by frame with ?t=… and encoded with ffmpeg. Deterministic: no screen recording.
//
//   npm run build && npm start -w apps/executar-web            # in another terminal
//   npx -p playwright node apps/executar-web/scripts/render-video.mjs [--url http://localhost:3000] [--out executar.mp4]
//
// Needs ffmpeg on PATH and a Playwright Chromium (`npx playwright install chromium` once).
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const base = arg('--url', 'http://localhost:3000'), out = arg('--out', 'executar-1920x1080.mp4');
const FPS = 30, END = 10.5, frames = Math.round(END * FPS) + 1;

let chromium;
try { ({ chromium } = await import('playwright')); } catch {
	console.error('Playwright não encontrado. Rode com: npx -p playwright node scripts/render-video.mjs'); process.exit(1);
}
const dir = await mkdtemp(join(tmpdir(), 'executar-video-'));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
for (let f = 0; f < frames; f++) {
	const t = (f / FPS).toFixed(3);
	await page.goto(`${base}/storyboard/render?t=${t}`, { waitUntil: f ? 'load' : 'networkidle' });
	if (!f) await page.evaluate(() => document.fonts.ready);
	await page.locator('#stage').screenshot({ path: join(dir, `f${String(f).padStart(4, '0')}.png`) });
	if (f % 30 === 0) process.stdout.write(`\rquadro ${f}/${frames - 1}`);
}
await browser.close();
process.stdout.write('\nencoding…\n');
await new Promise((res, rej) => {
	const p = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(dir, 'f%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', out], { stdio: 'inherit' });
	p.on('exit', c => (c === 0 ? res() : rej(new Error('ffmpeg saiu com ' + c))));
	p.on('error', rej);
});
await rm(dir, { recursive: true, force: true });
console.log('ok →', out);
