import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { APPS, BASE, pwa } from './pwa';

// Multi-page build: /m/ (hub) + /m/<slug>/ per mini app. Served by the apps/site Worker under /m/.
export default defineConfig({
	base: BASE,
	plugins: [react(), tailwindcss(), pwa()],
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		rollupOptions: {
			input: Object.fromEntries([['hub', resolve(__dirname, 'index.html')], ['landing', resolve(__dirname, 'landing', 'index.html')], ...APPS.map(a => [a.slug, resolve(__dirname, a.slug, 'index.html')])])
		}
	}
});
