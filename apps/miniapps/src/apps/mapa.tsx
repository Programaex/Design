// Mapa mental: grupo → entregável → tarefa, com marcação direto no mapa.
import { MapaTab } from '@executar/ui';
import { EmptyPlan, MiniApp } from '../shell/MiniApp';
import { useMiniApp } from '../shell/store';
import { mount } from './mount';

function Mapa() {
	const app = useMiniApp('mapa');
	const { s } = app;
	return <MiniApp slug="mapa" app={app}>{s.ready && (s.plan ? <MapaTab app={app} plan={s.plan} /> : <EmptyPlan app={app} what="O Mapa mental" />)}</MiniApp>;
}
mount(<Mapa />);
