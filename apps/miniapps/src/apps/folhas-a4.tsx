// Folhas A4: os quatro modelos preenchidos com o plano do aparelho (ou lorem ipsum para conferir o layout).
import * as C from '@executar/core';
import { ExportViewer } from '@executar/ui';
import { MiniApp } from '../shell/MiniApp';
import { useMiniApp } from '../shell/store';
import { mount } from './mount';

function FolhasA4() {
	const app = useMiniApp();
	const q = new URLSearchParams(window.location.search);
	const t = q.get('template'), c = q.get('content');
	return (
		<MiniApp slug="folhas-a4" app={app} wide>
			{app.s.ready && !app.s.plan && c !== 'lorem' && (
				<div className="border-b border-divider bg-surface px-4 py-2.5 text-center text-[13px] text-text-muted">
					Nenhum plano neste aparelho: as folhas mostram o plano de exemplo. <a href="/m/prisma/">Criar o seu no Prisma</a>.
				</div>
			)}
			<ExportViewer template={C.isTemplateId(t) ? t : null} content={c === 'lorem' ? 'lorem' : null} autoPrint={q.get('print') === '1'}
				onChange={(tpl, content) => {
					app.a.up({ exportTpl: tpl });
					window.history.replaceState(null, '', '?template=' + tpl + (content === 'lorem' ? '&content=lorem' : ''));
				}} />
		</MiniApp>
	);
}
mount(<FolhasA4 />);
