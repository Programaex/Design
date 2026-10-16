const { Button, RadioGroup, Dialog, Tag, TextField } = window.RiscoCognitivoDesignSystem_fab0ba;
function Assessment({ go }) {
  const qs = window.RC_DATA.questions;
  const [i, setI] = React.useState(0);
  const [ans, setAns] = React.useState({});
  const [done, setDone] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const score = Object.values(ans).reduce((a, b) => a + b, 0);
  const level = score <= 2 ? ['Baixo risco', 'success'] : score <= 5 ? ['Atenção', 'warning'] : ['Risco alto', 'danger'];
  const q = qs[i];
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: 'var(--space-16) var(--layout-edge) var(--layout-band)' }}>
      <div style={{ textAlign: 'center' }}>
        <h6 style={{ margin: 0 }}>Pergunta {i + 1} de {qs.length}</h6>
        <div style={{ height: 4, borderRadius: 980, background: 'var(--color-surface)', marginTop: 'var(--space-3)', overflow: 'hidden' }}><div style={{ height: '100%', width: ((i + (ans[i] !== undefined ? 1 : 0)) / qs.length * 100) + '%', background: 'var(--color-accent)', transition: 'width var(--duration-base) var(--ease-standard)' }}></div></div>
      </div>
      <h2 style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>{q.q}</h2>
      <div className="card" style={{ marginTop: 'var(--space-8)' }}>
        <RadioGroup key={i} name={'q' + i} value={ans[i] !== undefined ? String(ans[i]) : ''} onChange={v => setAns({ ...ans, [i]: Number(v) })} options={q.opts.map((o, k) => ({ value: String(k), label: o }))} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-6)' }}>
        <Button variant="secondary" disabled={i === 0} onClick={() => setI(i - 1)}>Voltar</Button>
        <Button disabled={ans[i] === undefined} onClick={() => i < qs.length - 1 ? setI(i + 1) : setDone(true)}>{i < qs.length - 1 ? 'Continuar' : 'Ver resultado'}</Button>
      </div>
      <Dialog open={done} onClose={() => setDone(false)} title={saved ? 'Resultado salvo.' : 'Seu perfil está pronto.'}
        actions={saved ? <Button onClick={() => go('home')}>Voltar ao início</Button> : <><Button variant="secondary" onClick={() => go('topic')}>Ver estratégias</Button><Button onClick={() => setSaved(true)}>Salvar resultado</Button></>}>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <div><Tag tone={level[1]}>{level[0]}</Tag></div>
          <span>{saved ? 'Enviamos um resumo para o seu e-mail.' : 'Com base nas respostas, seu controle executivo merece ' + (level[1] === 'success' ? 'manutenção.' : 'atenção nas situações de pressão.')}</span>
          {!saved && <TextField label="E-mail" type="email" placeholder="voce@exemplo.com" />}
        </div>
      </Dialog>
    </div>
  );
}
window.Assessment = Assessment;
