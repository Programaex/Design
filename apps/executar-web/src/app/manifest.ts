import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'EXECUTAR · Prisma',
		short_name: 'Prisma',
		description: 'Seu plano em três horizontes, uma ação por vez.',
		lang: 'pt-BR',
		start_url: '/app',
		scope: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#ffffff',
		icons: [
			{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
			{ src: '/icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }
		]
	};
}
