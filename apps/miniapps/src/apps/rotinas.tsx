// Rotinas do dia: reiniciam toda manhã (resetRoutinesIfNewDay ao abrir).
import { RotinasTab } from '@executar/ui';
import { EmptyPlan, MiniApp } from '../shell/MiniApp';
import { useMiniApp } from '../shell/store';
import { mount } from './mount';

function Rotinas() {
	const app = useMiniApp('rotinas');
	const { s } = app;
	return <MiniApp slug="rotinas" app={app}>{s.ready && (s.plan ? <RotinasTab app={app} plan={s.plan} /> : <EmptyPlan app={app} what="Rotinas" />)}</MiniApp>;
}
mount(<Rotinas />);
