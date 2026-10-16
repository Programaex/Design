import type { Metadata } from 'next';
import { Gallery } from '@/components/gallery/Gallery';

export const metadata: Metadata = { title: 'Galeria', description: 'Todas as telas do app Prisma e os quatro modelos A4.' };

export default function GalleryPage() {
	return <Gallery />;
}
