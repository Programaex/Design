// The landing was written for Next.js; these stand in for next/link and next/image on the static /m/landing/ page.
import type { CSSProperties, ReactNode } from 'react';

const ROUTES: Record<string, string> = { '/app': '/m/prisma/', '/galeria': '/m/', '/storyboard/render': '/m/landing/#storyboard', '/': '/m/landing/' };
const resolve = (href: string) => ROUTES[href] ?? (href.startsWith('/app/exportar') ? '/m/folhas-a4/' : href);

export function Link({ href, children, ...rest }: { href: string; children: ReactNode; className?: string }) {
	return <a href={resolve(href)} {...rest}>{children}</a>;
}

export function Image({ src, alt, style }: { src: string; alt: string; fill?: boolean; sizes?: string; draggable?: boolean; unoptimized?: boolean; priority?: boolean; style?: CSSProperties }) {
	return <img src={'/m' + src} alt={alt} draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} />;
}
