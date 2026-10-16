'use client';
// /app/exportar: the shared ExportViewer, with the template and content mirrored in the URL.
import * as C from '@executar/core';
import { ExportViewer } from '@executar/ui';
import { useRouter, useSearchParams } from 'next/navigation';

export function ExportRoute() {
	const router = useRouter();
	const q = useSearchParams();
	const t = q.get('template'), c = q.get('content');
	return (
		<ExportViewer template={C.isTemplateId(t) ? t : null} content={c === 'lorem' ? 'lorem' : null} autoPrint={q.get('print') === '1'}
			onBack={() => router.push('/app')}
			onChange={(tpl, content) => router.replace('/app/exportar?template=' + tpl + (content === 'lorem' ? '&content=lorem' : ''), { scroll: false })} />
	);
}
