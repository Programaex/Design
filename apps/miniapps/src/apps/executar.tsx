// Executar: Scroll Task — uma ação por vez, timer e quatro escopos sobre o plano do aparelho.
import { ExecutarTab } from '@executar/ui';
import { EmptyPlan, MiniApp } from '../shell/MiniApp';
import { useMiniApp } from '../shell/store';
import { mount } from './mount';

function Executar() {
	const app = useMiniApp('executar');
	const { s } = app;
	return (
		<MiniApp slug="executar" app={app} fill={!!s.plan}>
			{s.ready && (s.plan ? <ExecutarTab app={app} plan={s.plan} /> : <EmptyPlan app={app} what="O Executar" />)}
		</MiniApp>
	);
}
mount(<Executar />);
