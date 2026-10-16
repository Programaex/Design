const { Button, PromoTile, TextField } = window.RiscoCognitivoDesignSystem_fab0ba;
const caret = <i className="ph ph-caret-right" style={{ fontSize: 14 }}></i>;
const wrap = { maxWidth: 'var(--layout-column)', margin: '0 auto', padding: '0 var(--layout-edge)' };
const display = { fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'clamp(44px, 7vw, 80px)', lineHeight: 1.05, letterSpacing: '-0.015em', margin: 0 };
const sub = { fontSize: 'clamp(19px, 2.2vw, 28px)', lineHeight: 1.19, letterSpacing: '0.011em', color: 'var(--color-text-muted)', maxWidth: '48ch', margin: 'var(--space-4) auto 0' };
const sectionTitle = { fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-title)', lineHeight: 1.1, letterSpacing: '-0.003em', margin: 0, textAlign: 'center' };
const row = { display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginTop: 'var(--space-6)' };

function Home({ go }) {
  return (
    <>
      <div style={wrap}>
        <section style={{ textAlign: 'center', padding: 'var(--layout-band) 0 var(--space-12)' }}>
          <h1 style={display}><span style={{ display: 'block' }}>Pense antes.</span><span style={{ display: 'block' }}>Decida melhor.</span></h1>
          <p style={sub}>Entenda como o cérebro planeja, inibe e decide — e onde estão os riscos de cada processo cognitivo.</p>
          <div style={row}><Button onClick={() => go('explore')}>Explorar o cérebro</Button><Button variant="ghost" iconAfter={caret} onClick={() => go('topic')}>Ver funções executivas</Button></div>
          <img className="blend" src="../../assets/brand/svg/02_brain.svg" alt="Ilustração do cérebro em três lobos" style={{ width: 'min(420px, 80%)', margin: 'var(--space-12) auto 0' }} />
        </section>
      </div>
      <section style={{ background: 'var(--color-section)', color: 'var(--color-on-section)', padding: 'var(--space-16) 0' }}>
        <div style={{ ...wrap, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'clamp(24px, 3vw, 40px)', lineHeight: 1.15, letterSpacing: '-0.005em', maxWidth: '28ch', margin: '0 auto' }}>Toda decisão passa por três filtros: atenção, memória e controle.</p>
          <p style={{ fontSize: 'var(--text-card)', lineHeight: 1.19, color: 'color-mix(in srgb, var(--color-on-section) 64%, transparent)', margin: 'var(--space-4) auto 0', maxWidth: '44ch' }}>Quando um deles falha, o risco cognitivo aumenta.</p>
        </div>
      </section>
      <div style={wrap}>
        <section style={{ padding: 'var(--layout-band) 0 0' }}>
          <h2 style={sectionTitle}>Quatro caminhos. Um mesmo cérebro.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-12)' }}>
            <PromoTile kicker="01" title="Funções executivas" body="Planejar, inibir, alternar." actions={<Button size="sm" variant="ghost" iconAfter={caret} onClick={() => go('topic')}>Saiba mais</Button>} />
            <PromoTile kicker="02" title="Neurobiologia" body="As regiões por trás de cada função." actions={<Button size="sm" variant="ghost" iconAfter={caret} onClick={() => go('explore')}>Explorar</Button>} />
            <PromoTile kicker="03" title="Habilidades cognitivas" body="Atenção, memória e linguagem." actions={<Button size="sm" variant="ghost" iconAfter={caret} onClick={() => go('topic')}>Saiba mais</Button>} />
            <PromoTile kicker="04" title="Gestão de riscos" body="Estratégias para decidir sob pressão." actions={<Button size="sm" variant="ghost" iconAfter={caret} onClick={() => go('assess')}>Avaliar</Button>} />
          </div>
        </section>
        <section style={{ padding: 'var(--layout-band) 0', textAlign: 'center' }}>
          <h3 style={{ fontSize: 'var(--text-title)', lineHeight: 1.1, letterSpacing: '-0.003em', margin: 0 }}>Conheça seu perfil cognitivo.</h3>
          <p style={{ fontSize: 'var(--text-card)', lineHeight: 1.19, color: 'var(--color-text-muted)', maxWidth: '48ch', margin: 'var(--space-3) auto 0' }}>Quatro perguntas, dois minutos. Resultados só para você.</p>
          <div style={row}><Button onClick={() => go('assess')}>Começar avaliação</Button></div>
        </section>
      </div>
    </>
  );
}
window.Home = Home;
