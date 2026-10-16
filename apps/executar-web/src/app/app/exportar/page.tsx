import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ExportRoute } from '@/components/export/ExportRoute';

export const metadata: Metadata = { title: 'Exportar', description: 'Modelos A4 preenchidos com o seu plano: imprimir, salvar em PDF ou compartilhar em HTML.' };

export default function ExportPage() {
	return (
		<Suspense>
			<ExportRoute />
		</Suspense>
	);
}
