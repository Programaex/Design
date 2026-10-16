// Functional blocks: MapExplorer · AccountPanel · AuthForm · AdminPanel.
function MapExplorer({ id, nodes, edges, legend, initialSelection }) {
  const [sel, setSel] = React.useState(initialSelection || nodes[0].id);
  const [asList, setAsList] = React.useState(false);
  const [layer, setLayer] = React.useState('');
  const node = nodes.find(n => n.id === sel);
  const pos = Object.fromEntries(nodes.map(n => [n.id, n]));
  const linked = new Set(edges.filter(e => e[0] === sel || e[1] === sel).flat());
  const vis = n => !layer || n.group === layer;
  return (
    <div className="eco-wrap eco-pad-sm">
      <div className="eco-map-bar">
        <div className="eco-legend">
          <button className={'eco-leg' + (!layer ? ' on' : '')} onClick={() => setLayer('')}>Tudo</button>
          {legend.map(l => <button key={l.key} className={'eco-leg' + (layer === l.key ? ' on' : '')} onClick={() => setLayer(l.key)}><span className={'sw g-' + l.key}></span>{l.label}</button>)}
        </div>
        <button className="eco-clear" aria-pressed={asList} onClick={() => setAsList(!asList)}><i className={'ph ' + (asList ? 'ph-graph' : 'ph-list-bullets')}></i>{asList ? 'Ver mapa' : 'Ver como lista'}</button>
      </div>
      <div className="eco-map">
        {asList ? (
          <ul className="eco-map-list">
            {nodes.filter(vis).map(n => <li key={n.id}><button aria-pressed={sel === n.id} className={sel === n.id ? 'on' : ''} onClick={() => setSel(n.id)}><span className={'sw g-' + n.group}></span>{n.label}</button></li>)}
          </ul>
        ) : (
          <div className="eco-map-canvas" role="group" aria-label="Mapa interativo">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {edges.map(([a, b], k) => <line key={k} x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} className={(a === sel || b === sel) ? 'on' : ''} vectorEffect="non-scaling-stroke"></line>)}
            </svg>
            {nodes.map(n => (
              <button key={n.id} className={'eco-node g-' + n.group + (sel === n.id ? ' on' : '') + (linked.has(n.id) ? ' near' : '') + (vis(n) ? '' : ' dim')} style={{ left: n.x + '%', top: n.y + '%' }} onClick={() => setSel(n.id)} aria-pressed={sel === n.id}>{n.label}</button>
            ))}
          </div>
        )}
        <aside className="eco-map-detail" aria-live="polite">
          <span className="eco-kicker">{legend.find(l => l.key === node.group).label}</span>
          <h3>{node.label}</h3>
          <p>{LOREM.p.slice(0, 180)}.</p>
          <p className="muted">Conexões: {edges.filter(e => e.includes(sel)).map(e => pos[e[0] === sel ? e[1] : e[0]].label).join(', ') || '—'}</p>
        </aside>
      </div>
    </div>
  );
}

function AccountPanel({ id, mode }) {
  const { go } = useEco();
  return (
    <div className="eco-col eco-pad-sm">
      <div className="eco-form">
        <i className="ph ph-lock-key"></i>
        <h2>Sessão necessária</h2>
        <p className="muted">Área pessoal ({mode}). No ambiente integrado o servidor exige sessão; aqui não há autenticação real.</p>
        <div className="eco-form-foot"><Button onClick={() => go('/entrar')}>Entrar</Button><Button variant="secondary" onClick={() => go('/newsletter')}>Newsletter</Button></div>
      </div>
    </div>
  );
}

function AuthForm({ id, mode = 'entrar', returnTo }) {
  return <FormSection id={id} formId="autenticacao" title="Entrar" consent={false} submitLabel="Entrar" fields={[{ name: 'email', label: 'E-mail', type: 'email', required: true }, { name: 'senha', label: 'Senha', type: 'password', required: true }]} />;
}

function AdminPanel({ id, entity }) {
  return (
    <div className="eco-col eco-pad-sm">
      <div className="eco-form">
        <i className="ph ph-shield-check"></i>
        <h2>Área administrativa restrita</h2>
        <p className="muted">CMS · {entity}. Exige sessão e papel de administrador verificados no servidor. Não aparece na navegação pública; esconder links não protege a rota.</p>
      </div>
    </div>
  );
}

Object.assign(window, { MapExplorer, AccountPanel, AuthForm, AdminPanel });
