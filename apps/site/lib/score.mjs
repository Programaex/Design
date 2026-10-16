// Percentual de completude por nível (macro → meso → micro). Usado no build, nos testes e no CMS.
// done: { [microId]: true } → percentuais em cada nível.
export function score(macros, done) {
	let all = 0, ok = 0;
	const out = macros.map(m => {
		let mt = 0, mo = 0;
		const mesos = m.mesos.map(s => {
			const t = s.micros.length, o = s.micros.filter(x => done[x.id]).length;
			mt += t; mo += o;
			return { id: s.id, total: t, done: o, pct: t ? (o / t) * 100 : 0 };
		});
		all += mt; ok += mo;
		return { id: m.id, total: mt, done: mo, pct: mt ? (mo / mt) * 100 : 0, mesos };
	});
	return { total: all, done: ok, pct: all ? (ok / all) * 100 : 0, macros: out };
}
