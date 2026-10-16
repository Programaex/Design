const { Button, Card, SegmentedControl, Tag } = window.RiscoCognitivoDesignSystem_fab0ba;
function Explore({ go }) {
  const regions = window.RC_DATA.regions;
  const [sel, setSel] = React.useState('frontal');
  const r = regions.find(x => x.id === sel);
  return (
    <div style={{ maxWidth: 'var(--layout-column)', margin: '0 auto', padding: 'var(--space-16) var(--layout-edge) var(--layout-band)' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>Mapa do cérebro.</h1>
        <p style={{ fontSize: 'var(--text-card)', lineHeight: 1.19, color: 'var(--color-text-muted)', margin: 'var(--space-3) auto 0', maxWidth: '44ch' }}>Toque em uma região para ver o que ela faz — e o que pode dar errado.</p>
        <div style={{ marginTop: 'var(--space-6)' }}><SegmentedControl name="view" ariaLabel="Vista" options={[{ value: 'lat', label: 'Lateral' }, { value: 'sup', label: 'Superior' }, { value: 'med', label: 'Medial' }]} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 'var(--space-12)', alignItems: 'center', marginTop: 'var(--space-12)' }}>
        <div style={{ position: 'relative', aspectRatio: '1 / 1', maxWidth: 480, width: '100%', margin: '0 auto' }}>
          <img className="blend" src="../../assets/brand/svg/02_brain.svg" alt="Cérebro" style={{ width: '100%', height: '100%' }} />
          {regions.map(x => (
            <button key={x.id} aria-label={x.name} onClick={() => setSel(x.id)} style={{ position: 'absolute', left: x.x + '%', top: x.y + '%', width: 28, height: 28, marginLeft: -14, marginTop: -14, borderRadius: '50%', border: '2px solid #fff', background: sel === x.id ? 'var(--color-accent)' : 'rgba(29,29,31,0.55)', boxShadow: sel === x.id ? '0 0 0 6px color-mix(in srgb, var(--color-accent) 25%, transparent)' : 'none', cursor: 'pointer', transition: 'all var(--duration-base) var(--ease-standard)' }}></button>
          ))}
        </div>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          {regions.map(x => (
            <Card key={x.id} interactive onClick={() => setSel(x.id)} style={{ boxShadow: sel === x.id ? 'inset 0 0 0 2px var(--color-accent)' : 'none' }}
              kicker={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: x.color }}></span>{x.fn}</span>}
              title={x.name} body={sel === x.id ? x.body : null}>
              {sel === x.id && <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center', marginTop: 'var(--space-2)' }}>{x.risks.map(k => <Tag key={k} tone="warning">{k}</Tag>)}<Button size="sm" variant="ghost" iconAfter={<i className="ph ph-caret-right"></i>} onClick={e => { e.stopPropagation(); go('topic'); }}>Funções ligadas</Button></div>}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
window.Explore = Explore;
