import { cloudflareTest } from '@cloudflare/vitest-pool-workers';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		cloudflareTest({
			wrangler: { configPath: './wrangler.jsonc' },
			miniflare: { bindings: { CMS_USER: '000', CMS_PASS: '003', SESSION_SECRET: 'test-secret' } },
		}),
	],
	test: { include: ['test/**/*.test.js'] },
});
