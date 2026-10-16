const ECO_TWEAKS = /*EDITMODE-BEGIN*/{
  "site": "executar",
  "viewport": "desktop",
  "inspector": true,
  "buildTags": true,
  "blockLabels": false
}/*EDITMODE-END*/;

const readHash = () => { const h = decodeURIComponent(location.hash.slice(1)); return h.startsWith('/') ? h : null; };

function EcoApp() {
  const [t, setTweak] = useTweaks(ECO_TWEAKS);
  const [url, setUrl] = React.useState(() => readHash() || localStorage.getItem('eco-url') || '/');
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mapOpen, setMapOpen] = React.useState(false);
  const [narrow, setNarrow] = React.useState(false);
  const scrollRef = React.useRef(null);
  const frameRef = React.useRef(null);
  const btnRef = React.useRef(null);
  const site = ECO.SITES[t.site] || ECO.SITES.executar;
  const res = React.useMemo(() => ECO.resolve(url), [url]);

  const scrollTo = React.useCallback(id => {
    const sc = scrollRef.current; if (!sc) return false;
    const el = sc.querySelector('#' + CSS.escape(id));
    if (!el) return false;
    sc.scrollTo({ top: el.offsetTop - 64, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    return true;
  }, []);
  const go = React.useCallback(to => {
    if (!to) return;
    setMenuOpen(false);
    if (to !== readHash()) history.pushState(null, '', '#' + to);
    setUrl(to);
    localStorage.setItem('eco-url', to);
  }, []);

  React.useEffect(() => {
    const onPop = () => { const h = readHash() || '/'; setUrl(h); localStorage.setItem('eco-url', h); };
    window.addEventListener('popstate', onPop);
    if (!readHash()) history.replaceState(null, '', '#' + url);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  React.useEffect(() => {
    const sc = scrollRef.current; if (!sc) return;
    if (res.anchor) requestAnimationFrame(() => requestAnimationFrame(() => scrollTo(res.anchor)));
    else { sc.style.scrollBehavior = 'auto'; sc.scrollTop = 0; sc.style.scrollBehavior = ''; }
  }, [url]);
  React.useEffect(() => {
    const k = e => { if (e.key === 'Escape') { if (menuOpen) { setMenuOpen(false); btnRef.current && btnRef.current.focus(); } setMapOpen(false); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [menuOpen]);
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.style.overflowY = menuOpen ? 'hidden' : ''; }, [menuOpen]);
  React.useEffect(() => {
    const el = frameRef.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 768));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  React.useEffect(() => { document.title = (res.page ? res.page.title + ' · ' : '') + site.name; }, [res, site]);

  const ctx = { site, res, go, scrollTo, narrow, showTags: t.buildTags };
  return (
    <EcoCtx.Provider value={ctx}>
      <div className={'eco-stage' + (t.viewport === 'mobile' ? ' is-mobile' : '')}>
        <div ref={frameRef} className={'eco eco-frame' + (t.blockLabels ? ' eco-show-labels' : '') + (narrow ? ' is-narrow' : '')} data-theme="light" data-screen-label={res.url}>
          <a className="eco-skip" href="#conteudo" onClick={e => { e.preventDefault(); const m = scrollRef.current.querySelector('main'); m && m.focus(); }}>Pular para o conteúdo</a>
          <div className="eco-scroll" ref={scrollRef}>
            <GlobalHeader menuOpen={menuOpen} setMenuOpen={v => { setMenuOpen(v); if (!v && btnRef.current) btnRef.current.focus(); }} btnRef={btnRef} />
            <main id="conteudo" tabIndex={-1} key={site.key + res.url.split('#')[0]} data-pattern={res.pattern}><RoutePage /></main>
            <GlobalFooter />
          </div>
          {menuOpen && <EcosystemMenu close={() => setMenuOpen(false)} />}
          {t.inspector && <Inspector openMap={() => setMapOpen(true)} />}
          {mapOpen && <Sitemap close={() => setMapOpen(false)} />}
        </div>
      </div>
      <TweaksPanel>
        <TweakSection label="Ecossistema" />
        <TweakRadio label="Site" value={t.site} options={[{ value: 'executar', label: 'EXECUTAR' }, { value: 'risco', label: 'Risco Cognitivo' }]} onChange={v => setTweak('site', v)} />
        <TweakRadio label="Viewport" value={t.viewport} options={[{ value: 'desktop', label: 'Desktop' }, { value: 'mobile', label: 'Celular' }]} onChange={v => setTweak('viewport', v)} />
        <TweakSection label="Revisão" />
        <TweakToggle label="Tag “Em construção”" value={t.buildTags} onChange={v => setTweak('buildTags', v)} />
        <TweakToggle label="Mostrar blocos (tipo#id)" value={t.blockLabels} onChange={v => setTweak('blockLabels', v)} />
        <TweakToggle label="Inspetor de rota" value={t.inspector} onChange={v => setTweak('inspector', v)} />
        <TweakButton label="Abrir mapa de rotas" onClick={() => setMapOpen(true)} />
      </TweaksPanel>
    </EcoCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<EcoApp />);
