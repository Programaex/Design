import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-inter', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-plex-mono', display: 'swap' });

export const metadata: Metadata = {
	title: { default: 'EXECUTAR · Menos ruído. Mais execução.', template: '%s · EXECUTAR' },
	description: 'Do objetivo às próximas ações. Um plano em três horizontes, uma ação por vez na tela e folhas A4 prontas para imprimir.',
	applicationName: 'EXECUTAR · Prisma',
	appleWebApp: { capable: true, title: 'Prisma', statusBarStyle: 'default' }
};

export const viewport: Viewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR" className={`${inter.variable} ${plexMono.variable}`}>
			<body>{children}</body>
		</html>
	);
}
