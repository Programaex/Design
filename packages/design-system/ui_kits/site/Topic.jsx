const { Button, Card, Table, Tag } = window.RiscoCognitivoDesignSystem_fab0ba;
function Topic({ go }) {
  const fns = window.RC_DATA.functions;
  const measure = { maxWidth: 680, margin: '0 auto' };
  return (
    <>
      <div style={{ padding: 'var(--space-16) var(--layout-edge) 0' }}>
        <article style={measure}>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}><Tag tone="accent">Funções executivas</Tag><Tag tone="neutral">6 min de leitura</Tag></div>
          <h1 style={{ marginTop: 'var(--space-4)' }}>Controle inibitório.</h1>
          <p style={{ fontSize: 'var(--text-card)', lineHeight: 1.19, color: 'var(--color-text-muted)' }}>A capacidade de não fazer — e por que ela protege quase todas as suas decisões.</p>
          <img className="blend" src="../../assets/illustrations/brain-mono.svg" alt="" style={{ width: 280, margin: 'var(--space-12) auto' }} />
          <h4>O que é</h4>
          <p>O controle inibitório permite interromper uma resposta automática para escolher a mais adequada. Ele depende de uma rede que envolve o giro frontal inferior direito e os núcleos da base.</p>
          <h4 style={{ marginTop: 'var(--space-8)' }}>Onde surge o risco</h4>
          <p>Fadiga, estresse e privação de sono reduzem a eficiência dessa rede. O resultado são decisões mais rápidas, menos ponderadas e mais suscetíveis a vieses.</p>
          <div style={{ margin: 'var(--space-8) 0' }}>
            <Table columns={[{ key: 'f', label: 'Fator' }, { key: 'e', label: 'Efeito' }, { key: 'n', label: 'Nível', render: r => <Tag tone={r.t}>{r.n}</Tag> }]}
              rows={[{ f: 'Privação de sono', e: 'Respostas impulsivas', n: 'Alto', t: 'danger' }, { f: 'Multitarefa', e: 'Mais erros de omissão', n: 'Moderado', t: 'warning' }, { f: 'Pausas regulares', e: 'Recuperação do controle', n: 'Protetor', t: 'success' }]} />
          </div>
          <h4>Estratégias</h4>
          <p>Crie atrasos deliberados antes de decisões relevantes, reduza estímulos concorrentes e transforme regras em listas externas — assim a memória de trabalho fica livre para pensar.</p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginTop: 'var(--space-6)' }}><Button onClick={() => go('assess')}>Avaliar meu controle</Button><Button variant="ghost" iconAfter={<i className="ph ph-caret-right" style={{ fontSize: 14 }}></i>} onClick={() => go('explore')}>Ver no mapa</Button></div>
        </article>
      </div>
      <section style={{ background: 'var(--color-surface)', marginTop: 'var(--layout-band)', padding: 'var(--space-16) var(--layout-edge)' }}>
        <div style={{ maxWidth: 'var(--layout-column)', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', margin: 0 }}>Continue explorando.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-12)' }}>
            {fns.map(f => <Card key={f.id} interactive kicker={f.kicker} title={f.title} body={f.body} meta={<><i className="ph ph-clock"></i><span>{f.time}</span></>} style={{ background: 'var(--color-bg)' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />)}
          </div>
        </div>
      </section>
    </>
  );
}
window.Topic = Topic;
