// Showroom family blocks (REF-03): CategoryRail · FeaturedCarousel · CollectionTabs · FilterBar · ResourceGrid · DirectoryLinks · SearchResults.
function CategoryRail({ id, items, activeValue }) {
  return (
    <div className="eco-wrap">
      <nav className="eco-cats" aria-label="Categorias">
        {items.map((it, k) => (
          <A key={k} to={it.href} className={'eco-cat' + (activeValue === it.value ? ' on' : '')} aria-current={activeValue === it.value ? 'true' : undefined}>
            <Media kind="icon" name={`${id}-${it.value}`} className="eco-cat-icon" />
            <span>{it.label}</span>
          </A>
        ))}
      </nav>
    </div>
  );
}

function FeaturedCarousel({ id, label, items }) {
  const [i, setI] = React.useState(0);
  const n = items.length;
  const key = e => { if (e.key === 'ArrowRight') setI(x => Math.min(n - 1, x + 1)); if (e.key === 'ArrowLeft') setI(x => Math.max(0, x - 1)); };
  return (
    <div className="eco-featured" tabIndex={0} onKeyDown={key} aria-roledescription="carrossel" aria-label={label}>
      <div className="eco-wrap"><h2 className="eco-section-title eco-mb">{label}</h2></div>
      <div className="eco-feat-view">
        <div className="eco-feat-track" style={{ transform: `translateX(calc(${-i} * (var(--feat-w) + 20px)))` }}>
          {items.map((it, k) => (
            <div key={k} className="eco-feat-card" aria-hidden={k !== i}>
              <div className="eco-feat-text">
                <span className="eco-kicker">{it.kicker}</span>
                <h3>{it.title}</h3>
                <p>{it.description}</p>
                <A to={it.href} tabIndex={k === i ? 0 : -1}>Ver detalhes ›</A>
              </div>
              <Media kind="landscape" name={`${id}-${k + 1}`} className="r12" />
            </div>
          ))}
        </div>
      </div>
      <div className="eco-dots-row">
        <button className="eco-round sm" aria-label="Anterior" disabled={i === 0} onClick={() => setI(i - 1)}><i className="ph-bold ph-caret-left"></i></button>
        <div className="eco-dots">{items.map((_, k) => <button key={k} aria-label={`Destaque ${k + 1}`} aria-current={k === i} className={'eco-dot' + (k === i ? ' on' : '')} onClick={() => setI(k)}></button>)}</div>
        <button className="eco-round sm" aria-label="Próximo" disabled={i === n - 1} onClick={() => setI(i + 1)}><i className="ph-bold ph-caret-right"></i></button>
      </div>
    </div>
  );
}

// stateKey that is a facet → selection lives in the URL; otherwise local state.
function CollectionTabs({ id, title, items, stateKey, defaultValue }) {
  const { res, go } = useEco();
  const isFacet = !!ECO.FACETS[stateKey] && (res.page.filters || []).includes(stateKey);
  const [local, setLocal] = React.useState(defaultValue || '');
  const cur = isFacet ? (res.query[stateKey] || '') : local;
  const pick = v => isFacet ? go(ECO.withQuery(res.path, { ...res.query, [stateKey]: v || undefined, pagina: undefined })) : setLocal(v);
  return (
    <div className="eco-wrap eco-tabs-wrap">
      <h2 className="eco-section-title">{title}</h2>
      <div className="eco-ctabs" role="tablist" aria-label={title}>
        {[{ value: '', label: 'Todos' }, ...items].map(it => <button key={it.value} role="tab" aria-selected={cur === it.value} className={'eco-ctab' + (cur === it.value ? ' on' : '')} onClick={() => pick(it.value)}>{it.label}</button>)}
      </div>
    </div>
  );
}

function FilterBar({ id, facets, query, searchEnabled = true }) {
  const { res, go } = useEco();
  const [q, setQ] = React.useState(query.q || '');
  React.useEffect(() => setQ(query.q || ''), [query.q]);
  const set = (k, v) => go(ECO.withQuery(res.path, { ...query, [k]: v || undefined, pagina: undefined }));
  const active = Object.keys(query).filter(k => k !== 'pagina');
  return (
    <div className="eco-wrap">
      <div className="eco-filterbar" role="search">
        {searchEnabled && (
          <form className="eco-search" onSubmit={e => { e.preventDefault(); set('q', q.trim()); }}>
            <i className="ph ph-magnifying-glass"></i>
            <input aria-label="Buscar" placeholder="Buscar" value={q} onChange={e => setQ(e.target.value)} />
          </form>
        )}
        {facets.map(f => (
          <label key={f.key} className={'eco-facet' + (query[f.key] ? ' on' : '')}>
            <span className="sr">{f.label}</span>
            <select value={query[f.key] || ''} onChange={e => set(f.key, e.target.value)}>
              <option value="">{f.label}</option>
              {f.values.map(v => <option key={v} value={v}>{ECO.label(v)}</option>)}
            </select>
            <i className="ph ph-caret-down"></i>
          </label>
        ))}
        {active.length > 0 && <button className="eco-clear" onClick={() => go(res.path)}>Limpar filtros</button>}
      </div>
    </div>
  );
}

function ResourceCard({ it, size, base, k, id }) {
  const wide = size === 'w' || size === 'b';
  return (
    <A to={it.href} className={'eco-rc s-' + size}>
      {wide && <div className="eco-rc-head"><span className="eco-rc-cat">{it.category}</span><h3 className="eco-rc-big">{it.title}</h3></div>}
      <Media kind={wide ? 'landscape' : 'square'} name={`${id}-${it.slug}`} className="eco-rc-media" fit={wide ? 'cover' : 'contain'} />
      {!wide && <div className="eco-rc-body"><span className="eco-kicker">{it.kicker}</span><h3>{it.title}</h3><span className="eco-rc-meta">{it.meta}</span></div>}
      {wide && <span className="eco-rc-go" aria-hidden="true"><i className="ph-bold ph-caret-right"></i></span>}
    </A>
  );
}

const MOSAIC = ['s', 's', 'w', 's', 'b', 's', 's', 's', 'w', 's', 's', 's'];

function ResourceGrid({ id, items, variant = 'mosaic', pagination, total }) {
  const { res, go } = useEco();
  const page = pagination ? pagination.page : 1;
  const pages = pagination ? pagination.pages : 1;
  const pager = pages > 1 && (
    <nav className="eco-pager" aria-label="Paginação">
      {Array.from({ length: pages }, (_, k) => <button key={k} aria-current={page === k + 1 ? 'page' : undefined} className={'eco-pg' + (page === k + 1 ? ' on' : '')} onClick={() => go(ECO.withQuery(res.path, { ...res.query, pagina: k ? String(k + 1) : undefined }))}>{k + 1}</button>)}
    </nav>
  );
  if (!items.length) return <div className="eco-wrap eco-pad-sm"><div className="eco-empty"><i className="ph ph-funnel-x"></i><p>Nenhum resultado para estes filtros.</p><Button variant="secondary" onClick={() => go(res.path)}>Limpar filtros</Button></div></div>;
  return (
    <div className="eco-wrap eco-pad-sm">
      <p className="eco-count">{total} {total === 1 ? 'item' : 'itens'} · exemplos demonstrativos</p>
      {variant === 'mosaic' ? (
        <div className="eco-mosaic">{items.map((it, k) => <ResourceCard key={it.slug} it={it} size={Object.keys(res.query).length ? 's' : MOSAIC[k % MOSAIC.length]} k={k} id={id} />)}</div>
      ) : (
        <div className="eco-cards3">
          {items.map((it, k) => (
            <A key={it.slug} to={it.href} className="eco-rcard">
              <Media kind={variant === 'people' ? 'portrait' : 'cover'} name={`${id}-${it.slug}`} className="r18" />
              <span className="eco-kicker">{it.kicker}</span><h3>{it.title}</h3><p className="muted">{it.meta}</p>
            </A>
          ))}
        </div>
      )}
      {pager}
    </div>
  );
}

function DirectoryLinks({ id, title, groups }) {
  return (
    <div className="eco-wrap eco-pad">
      {title && <h2 className="eco-section-title eco-mb">{title}</h2>}
      <div className="eco-dir">
        {groups.map((g, k) => (
          <div key={k} className={'eco-dir-col' + (g.big ? ' big' : '')}>
            <span className="eco-dir-h">{g.title}</span>
            {g.links.map(([l, to], j) => to ? <A key={j} to={to}>{l}</A> : <span key={j} className="eco-dir-off">{l} <em>a configurar</em></span>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchResults({ id, query, items }) {
  if (!query) return <div className="eco-wrap eco-pad-sm"><p className="eco-empty"><i className="ph ph-magnifying-glass"></i>Digite um termo para buscar em conteúdos, mapas e recursos públicos.</p></div>;
  return (
    <div className="eco-wrap eco-pad-sm">
      <p className="eco-count">{items.length} resultados para “{query}” · exemplos demonstrativos</p>
      <div className="eco-results">{items.map((it, k) => <A key={k} to={it.href} className="eco-result"><span className="eco-kicker">{it.kicker}</span><h3>{it.title}</h3><p className="muted">{it.url}</p></A>)}</div>
    </div>
  );
}

Object.assign(window, { CategoryRail, FeaturedCarousel, CollectionTabs, FilterBar, ResourceCard, ResourceGrid, DirectoryLinks, SearchResults });
