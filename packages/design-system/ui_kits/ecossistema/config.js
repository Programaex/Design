// Ecossistema config — sites, menus, page patterns, filters, router. Reads ECO_ROUTES (CSV) + ECO_BP (blueprints).
(function () {
  const R = window.ECO_ROUTES;
  const BP = window.ECO_BP;
  const byId = Object.fromEntries(R.map(r => [r.id, r]));

  const SITES = {
    executar: { key: 'executar', name: 'EXECUTAR', logo: '../../assets/logo/executar-mark.svg', mono: true, about: 'Conheça o EXECUTAR', domain: 'executar — domínio a definir' },
    risco: { key: 'risco', name: 'Risco Cognitivo', logo: '../../assets/brand/svg/02_brain.svg', about: 'Conheça o Risco Cognitivo', domain: 'riscocognitivo — domínio a definir' }
  };

  // Main nav (CSV order): logo = inicio; then 5 links. Utilities: busca · conta · hambúrguer.
  const MAIN = ['blog', 'riscos', 'mapa', 'apps', 'ferramentas'];

  // Hamburger groups — order and labels from the brief; `root` = group landing page (heading link on desktop).
  const GROUPS = [
    { key: 'Conheça o EXECUTAR', root: 'sobre', items: [['sobre', 'Sobre o projeto'], ['autor'], ['metodologia'], ['editorial', 'Princípios editoriais'], ['parceiros']] },
    { key: 'Conteúdos', root: 'blog', items: [['blog'], ['blog_artigo'], ['blog_guia'], ['blog_tutorial'], ['blog_video'], ['blog_noticia'], ['blog_framework'], ['blog_evidencia'], ['blog_curadoria']] },
    { key: 'Cognição e mapas', root: 'mapas', items: [['riscos'], ['mapa'], ['mapa_neuro'], ['mapa_projetos'], ['mapas']] },
    { key: 'Apps', root: 'apps', items: [['apps', 'Todos os apps'], ['executar_app'], ['app_funcoes'], ['app_como'], ['app_acessar', 'Acessar o aplicativo']] },
    { key: 'Ferramentas e recursos', root: 'ferramentas', items: [['ferramentas', 'Catálogo completo'], ['recurso_ia-agentes'], ['recurso_skills'], ['recurso_prompts', 'Prompts e photoprompts'], ['recurso_workflows'], ['recurso_templates'], ['recurso_assets'], ['recurso_ebooks']] },
    { key: 'Loja e marketplace', root: 'loja', items: [['loja_digitais'], ['loja_fisicos'], ['loja_livros'], ['loja_cursos'], ['loja_afiliados']] },
    { key: 'Comunidade', root: 'comunidade', items: [['comunidade_discussoes'], ['comunidade_perguntas'], ['comunidade_compartilhamentos'], ['comunidade_sugestoes']] },
    { key: 'Consultoria e Studio', root: 'studio', items: [['consultoria'], ['studio_servicos'], ['cases'], ['briefing']] }
  ];
  const BASE = [['busca', 'ph-magnifying-glass'], ['conta', 'ph-user-circle'], ['newsletter', 'ph-envelope-simple'], ['contato', 'ph-chat-circle'], ['redes', 'ph-share-network']];
  const FOOTER = R.filter(r => r.nav.includes('rodape')).map(r => r.id);

  // CSV template → one of the four page patterns requested (Home · Produto · Artigo · Showroom) + restricted.
  const PATTERN = {
    landing: 'home', institucional: 'home', servicos: 'home', servico: 'home',
    produto_app: 'produto', produto: 'produto', recurso: 'produto',
    conteudo: 'artigo', risco: 'artigo', case: 'artigo', topico: 'artigo', formulario: 'artigo', conta: 'artigo', autenticacao: 'artigo',
    catalogo_conteudos: 'showroom', catalogo_riscos: 'showroom', catalogo_apps: 'showroom', catalogo_recursos: 'showroom', catalogo_mapas: 'showroom',
    catalogo_produtos: 'showroom', catalogo_projetos: 'showroom', mapa_interativo: 'showroom', comunidade: 'showroom', busca_global: 'showroom',
    admin: 'admin', admin_crud: 'admin'
  };
  const PATTERN_LABEL = { home: 'Home', produto: 'Produto', artigo: 'Artigo', showroom: 'Showroom', admin: 'Restrito', notfound: '404' };

  // Facets (ADR §5.1). The UI only offers the facets the CSV lists for the page.
  const FACETS = {
    perfil: { label: 'Perfil', values: ['tdah', 'dislexia', 'autismo', 'altas-habilidades', 'neurodivergencia'] },
    objetivo: { label: 'Objetivo', values: ['estudar', 'trabalhar', 'rotina', 'projetos', 'processos'] },
    formato: { label: 'Formato', values: ['artigo', 'guia', 'tutorial', 'video', 'noticia', 'framework', 'evidencia', 'curadoria'] },
    tecnologia: { label: 'Tecnologia', values: ['ia', 'agentes', 'skills', 'prompts', 'workflows', 'apps'] },
    disponibilidade: { label: 'Disponibilidade', values: ['gratuito', 'pago'] },
    tipo: { label: 'Tipo', values: ['ia-agentes', 'skills', 'prompts', 'photoprompts', 'workflows', 'templates', 'assets', 'ebooks'] },
    categoria: { label: 'Categoria', values: ['digitais', 'fisicos', 'livros', 'cursos', 'afiliados'] }
  };
  const COMMUNITY_TIPO = ['discussoes', 'perguntas', 'compartilhamentos', 'sugestoes'];
  const LABELS = { tdah: 'TDAH', dislexia: 'Dislexia', autismo: 'Autismo', 'altas-habilidades': 'Altas habilidades', neurodivergencia: 'Neurodivergência', estudar: 'Estudar', trabalhar: 'Trabalhar', rotina: 'Rotina', projetos: 'Projetos', processos: 'Processos', artigo: 'Artigo', guia: 'Guia', tutorial: 'Tutorial', video: 'Vídeo', noticia: 'Notícia', framework: 'Framework', evidencia: 'Evidência', curadoria: 'Curadoria', ia: 'IA', agentes: 'Agentes', skills: 'Skills', prompts: 'Prompts', workflows: 'Workflows', apps: 'Apps', gratuito: 'Gratuito', pago: 'Pago', 'ia-agentes': 'IA e agentes', photoprompts: 'Photoprompts', templates: 'Templates', assets: 'Assets', ebooks: 'E-books', digitais: 'Digitais', fisicos: 'Físicos', livros: 'Livros', cursos: 'Cursos', afiliados: 'Afiliados', discussoes: 'Discussões', perguntas: 'Perguntas', compartilhamentos: 'Compartilhamentos', sugestoes: 'Sugestões' };

  // Detail route each catalog links to; demo slugs exemplo-1…exemplo-12 resolve, anything else → 404.
  const DETAIL = { blog: '/blog/', riscos: '/riscos-cognitivos/', apps: '/apps/', ferramentas: '/ferramentas/', loja: '/loja/', mapas: '/mapas/', mapa: '/mapas/', cases: '/studio/projetos/', comunidade: '/comunidade/topicos/', busca: '/blog/' };
  const DEMO_SLUG = /^exemplo-([1-9]|1[0-2])$/;

  const pagePaths = R.filter(r => r.type === 'pagina').reduce((m, r) => (m[r.url] = r, m), {});
  const dynamics = R.filter(r => r.type === 'dinamica').map(r => ({ r, re: new RegExp('^' + r.url.replace('[slug]', '([^/]+)') + '$') }));

  function parse(url) {
    const [beforeHash, anchor = ''] = url.split('#');
    const [path, qs = ''] = beforeHash.split('?');
    return { path: path || '/', query: Object.fromEntries(new URLSearchParams(qs)), anchor, qs };
  }
  function cleanQuery(page, query) {
    const allowed = page.template === 'comunidade' ? { tipo: COMMUNITY_TIPO } : Object.fromEntries((page.filters || []).filter(f => FACETS[f]).map(f => [f, FACETS[f].values]));
    const q = {};
    for (const [k, v] of Object.entries(query)) {
      if (allowed[k] && allowed[k].includes(v)) q[k] = v;
      else if (k === 'q' && v) q.q = v;
      else if (k === 'pagina' && /^[1-9]\d*$/.test(v)) q.pagina = v;
    }
    return q;
  }
  function resolve(url) {
    const p = parse(url);
    const entry = R.find(r => r.url === url) || null;
    let page = pagePaths[p.path], slug = null;
    if (!page) {
      for (const d of dynamics) { const m = p.path.match(d.re); if (m) { page = d.r; slug = m[1]; break; } }
      const isArticle = page && page.id === 'conteudo' && (window.ECO_ARTICLES || []).some(a => a.slug === slug);
      // mini apps PWA (apps/miniapps/catalog.json → miniapps.js) têm página de detalhe em /apps/<slug> ou /ferramentas/<slug>
      const isMiniApp = page && (window.ECO_MINIAPPS || []).some(a => a.slug === slug && p.path === '/' + a.catalog + '/' + slug);
      if (page && !DEMO_SLUG.test(slug) && !isArticle && !isMiniApp) return { ...p, url, entry: null, page: null, slug, pattern: 'notfound' };
    }
    if (!page) return { ...p, url, entry, page: null, pattern: 'notfound' };
    const bp = BP[page.id];
    return { ...p, url, entry: entry || page, page, bp, slug, query: cleanQuery(page, p.query), pattern: PATTERN[page.template] || 'artigo' };
  }
  function withQuery(path, query) {
    const qs = new URLSearchParams(Object.entries(query).filter(([, v]) => v != null && v !== '')).toString();
    return path + (qs ? '?' + qs : '');
  }

  window.ECO = { R, BP, byId, SITES, MAIN, GROUPS, BASE, FOOTER, PATTERN, PATTERN_LABEL, FACETS, COMMUNITY_TIPO, LABELS, DETAIL, resolve, parse, withQuery, label: v => LABELS[v] || v };
})();
