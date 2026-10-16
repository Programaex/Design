// Core primitives + global shell (GlobalHeader · EcosystemMenu · GlobalFooter) + review tools.
const { Button, Tag, NavBar, TextField } = window.RiscoCognitivoDesignSystem_fab0ba;
const EcoCtx = React.createContext(null);
const useEco = () => React.useContext(EcoCtx);

const LOREM = {
  t: 'Lorem ipsum dolor.',
  t2: 'Lorem ipsum dolor sit amet.',
  s: 'Consectetur adipiscing elit, sed do eiusmod tempor.',
  p: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  p2: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  p3: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
};

// Local placeholders from the package (ADR §9). image-slot shows the SVG until a real image is dropped.
const PH = {
  hero: ['hero-wide.svg', 1920, 1080], landscape: ['feature-landscape.svg', 1200, 900], cover: ['article-cover.svg', 1600, 900],
  square: ['resource-square.svg', 1000, 1000], icon: ['category-icon.svg', 240, 240], portrait: ['portrait.svg', 600, 800]
};

function A({ to, children, className, style, ...rest }) {
  const { go } = useEco();
  return <a href={'#' + to} className={className} style={style} onClick={e => { e.preventDefault(); go(to); }} {...rest}>{children}</a>;
}

function Media({ kind = 'landscape', name, fit, ratio, alt = '', className = '', style, src }) {
  const { site, res } = useEco();
  if (src) return <div className={'eco-media eco-media-real ' + className} style={{ aspectRatio: ratio || PH[kind][1] + '/' + PH[kind][2], ...style }}><img src={src} alt={alt} loading="lazy" /></div>;
  const [file, w, h] = PH[kind];
  const pid = res.page ? res.page.id + (res.slug ? '-' + res.slug : '') : 'x';
  return (
    <div className={'eco-media ' + className} style={{ aspectRatio: ratio || `${w}/${h}`, ...style }} role={alt ? 'img' : undefined} aria-label={alt || undefined}>
      <image-slot id={`${site.key}-${pid}-${name}`} shape="rect" fit={fit || (kind === 'square' || kind === 'icon' ? 'contain' : 'cover')} src={'../../assets/placeholders/' + file} placeholder={`${res.page ? res.page.url : ''} · ${name}`}></image-slot>
    </div>
  );
}

function BuildTag({ dark }) {
  const { showTags } = useEco();
  if (!showTags) return null;
  return <Tag tone="warning" className={'eco-build' + (dark ? ' on-dark' : '')} icon={<i className="ph ph-hammer"></i>}>Em construção</Tag>;
}

// Actions: max two; an action without href renders disabled with a short reason (never href="#").
function Actions({ actions = [], center = true, size }) {
  const { go } = useEco();
  if (!actions.length) return null;
  return (
    <div className={'eco-actions' + (center ? ' center' : '')}>
      {actions.slice(0, 2).map((a, k) => a.href
        ? <Button key={k} variant={k === 0 ? 'primary' : 'secondary'} size={size} onClick={() => go(a.href)}>{a.label}</Button>
        : <Button key={k} variant={k === 0 ? 'primary' : 'secondary'} size={size} disabled title={a.reason}>{a.label}</Button>)}
    </div>
  );
}

function Brand() {
  const { site } = useEco();
  return <><img src={site.logo} alt="" className={site.mono ? 'eco-mark mono' : 'eco-mark'} /><span className="eco-wordmark">{site.name}</span></>;
}

function GlobalHeader({ menuOpen, setMenuOpen, btnRef }) {
  const { go, res } = useEco();
  const links = ECO.MAIN.map(id => { const r = ECO.byId[id]; return { label: r.title, href: r.url, current: res.path === r.url }; });
  return (
    <NavBar
      brand={<Brand />}
      links={links}
      onBrandClick={() => { setMenuOpen(false); go('/'); }}
      onNavigate={l => { setMenuOpen(false); go(l.href); }}
      action={
        <span className="eco-nav-actions">
          <button className="eco-icon-btn" aria-label="Busca" onClick={() => { setMenuOpen(false); go('/busca'); }}><i className="ph ph-magnifying-glass"></i></button>
          <button className="eco-icon-btn eco-only-desktop" aria-label="Minha conta" onClick={() => { setMenuOpen(false); go('/minha-conta'); }}><i className="ph ph-user-circle"></i></button>
          <button ref={btnRef} className="eco-icon-btn" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu do ecossistema'} aria-expanded={menuOpen} aria-controls="eco-menu" onClick={() => setMenuOpen(!menuOpen)}><i className={'ph ' + (menuOpen ? 'ph-x' : 'ph-list')}></i></button>
        </span>
      }
    />
  );
}

function EcosystemMenu({ close }) {
  const { go, site, narrow } = useEco();
  const [open, setOpen] = React.useState(() => new Set());
  const ref = React.useRef(null);
  const nav = to => { close(); go(to); };
  const toggle = k => setOpen(s => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const f = el.querySelector('a,button'); f && f.focus();
    const trap = e => {
      if (e.key !== 'Tab') return;
      const items = [...el.querySelectorAll('a,button')]; if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    el.addEventListener('keydown', trap); return () => el.removeEventListener('keydown', trap);
  }, []);
  const L = (id, alt) => { const r = ECO.byId[id]; return <a key={id} href={'#' + r.url} onClick={e => { e.preventDefault(); nav(r.url); }}>{alt || r.title}{r.type !== 'pagina' && <span className="eco-q">{r.type === 'filtro' ? 'filtro' : 'seção'}</span>}</a>; };
  const label = g => g.key === 'Conheça o EXECUTAR' ? site.about : g.key;
  return (
    <div id="eco-menu" ref={ref} className="eco-menu" role="dialog" aria-modal="true" aria-label="Menu do ecossistema">
      <div className="eco-menu-inner">
        {narrow ? (
          <>
            <div className="eco-menu-main">{L('inicio', 'Início')}{ECO.MAIN.map(id => L(id))}</div>
            {ECO.GROUPS.map(g => {
              const isOpen = open.has(g.key);
              return (
                <div key={g.key} className={'eco-acc' + (isOpen ? ' open' : '')}>
                  <button className="eco-acc-head" aria-expanded={isOpen} onClick={() => toggle(g.key)}>{label(g)}<i className="ph ph-caret-down"></i></button>
                  {isOpen && <div className="eco-acc-body">{g.root && !g.items.some(i => i[0] === g.root) && L(g.root, 'Visão geral')}{g.items.map(([id, alt]) => L(id, alt))}</div>}
                </div>
              );
            })}
          </>
        ) : (
          <div className="eco-menu-cols">
            {ECO.GROUPS.map(g => (
              <div key={g.key} className="eco-menu-col">
                <A to={ECO.byId[g.root].url} className="eco-menu-h">{label(g)}</A>
                {g.items.map(([id, alt]) => L(id, alt))}
              </div>
            ))}
          </div>
        )}
        <div className="eco-menu-base">
          {ECO.BASE.map(([id, ic]) => { const r = ECO.byId[id]; return <a key={id} href={'#' + r.url} onClick={e => { e.preventDefault(); nav(r.url); }}><i className={'ph ' + ic}></i>{r.title}</a>; })}
        </div>
      </div>
    </div>
  );
}

function GlobalFooter() {
  const { site, res } = useEco();
  const crumbs = [];
  for (let r = res.page; r && r.id !== 'inicio'; r = ECO.byId[r.parent]) crumbs.unshift(r);
  return (
    <footer className="eco-footer" data-section="GlobalFooter">
      <div className="eco-wrap">
        <p className="eco-foot-note">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Conteúdo educativo — não substitui avaliação profissional nem constitui diagnóstico.</p>
        <nav className="eco-crumbs" aria-label="Você está em">
          <A to="/" aria-label="Início"><img src={site.logo} alt="" className={site.mono ? 'eco-mark mono' : 'eco-mark'} /></A>
          {crumbs.map(r => <React.Fragment key={r.id}><i className="ph ph-caret-right"></i><A to={r.url}>{r.title}</A></React.Fragment>)}
        </nav>
        <div className="eco-foot-dir">
          {ECO.GROUPS.map(g => (
            <div key={g.key}>
              <h3>{g.key === 'Conheça o EXECUTAR' ? site.about : g.key}</h3>
              {g.items.filter(([id]) => ECO.byId[id].type !== 'ancora').slice(0, 6).map(([id, alt]) => <A key={id} to={ECO.byId[id].url}>{alt || ECO.byId[id].title}</A>)}
            </div>
          ))}
        </div>
        <div className="eco-foot-legal">
          <span>Copyright © 2026 {site.name}. Todos os direitos reservados.</span>
          <span className="eco-foot-links">{ECO.FOOTER.map(id => <A key={id} to={ECO.byId[id].url}>{ECO.byId[id].title}</A>)}</span>
          <span>{site.domain}</span>
        </div>
      </div>
    </footer>
  );
}

function Inspector({ openMap }) {
  const { res } = useEco();
  const e = res.entry;
  return (
    <div className="eco-inspector">
      <code>{res.url}</code>
      <span className="eco-insp-meta">{res.page ? res.page.template : '—'} → {ECO.PATTERN_LABEL[res.pattern]}{e && e.type !== 'pagina' ? ` · ${e.type}` : ''}</span>
      <button onClick={openMap}>Rotas (78)</button>
    </div>
  );
}

function Sitemap({ close }) {
  const { go, res } = useEco();
  const [q, setQ] = React.useState('');
  const rows = ECO.R.filter(r => !q || (r.title + r.url + r.template).toLowerCase().includes(q.toLowerCase()));
  const ex = r => r.url.replace('[slug]', 'exemplo-1');
  return (
    <div className="eco-sitemap" onClick={close}>
      <div className="eco-sitemap-panel" onClick={e => e.stopPropagation()}>
        <div className="eco-sitemap-top"><h2>Rotas</h2><button className="eco-icon-btn" aria-label="Fechar" onClick={close}><i className="ph ph-x"></i></button></div>
        <p className="muted">78 entradas do CSV. Envie copy e imagens citando rota + id da seção (ative “Mostrar blocos”).</p>
        <TextField placeholder="Filtrar rotas" value={q} onChange={e => setQ(e.target.value)} />
        <div>
          {rows.map(r => (
            <div key={r.id} className={'eco-sitemap-row' + (res.url === ex(r) ? ' on' : '')} onClick={() => { close(); go(ex(r)); }}>
              <span className="muted">{r.order}</span>
              <span>{r.title}<code>{r.url} · {ECO.BP[r.id].blocks.join(' › ')}</code></span>
              <Tag tone={r.access === 'publico' ? 'neutral' : 'danger'}>{ECO.PATTERN_LABEL[ECO.PATTERN[r.template]]}</Tag>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { EcoCtx, useEco, LOREM, PH, A, Media, BuildTag, Actions, GlobalHeader, EcosystemMenu, GlobalFooter, Inspector, Sitemap, Button, Tag, TextField });
