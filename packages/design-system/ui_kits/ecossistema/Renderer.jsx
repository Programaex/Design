// Typed block registry + recipes. Each route → blueprint.contentBlocks → [{ id, type, version, props }] → rendered in order.
const REGISTRY = {
  GlobalHeader: null, EcosystemMenu: null, GlobalFooter: null, // shell — rendered once by EcoApp
  HeroCampaign, FeatureSplit, PromoGrid, PageIntro, CategoryRail, FeaturedCarousel, CollectionTabs, ResourceGrid, FilterBar,
  ArticleHeader, RichText, MediaFigure, EvidenceList, RelatedContent, MapExplorer, FormSection, DiscussionFeed, BenefitsRow,
  DirectoryLinks, Newsletter, DetailHeader, AccountPanel, AdminPanel, SearchResults, AuthForm
};
// requiredProps from sources/executar/blocks.registry.json
const REQUIRED = {
  HeroCampaign: ['title', 'media', 'actions'], FeatureSplit: ['title', 'body', 'media'], PromoGrid: ['items'], PageIntro: ['title'], CategoryRail: ['items'],
  FeaturedCarousel: ['items'], CollectionTabs: ['items', 'stateKey'], ResourceGrid: ['items'], FilterBar: ['facets'], ArticleHeader: ['title'], RichText: ['content'],
  MediaFigure: ['media'], EvidenceList: ['items'], RelatedContent: ['items'], MapExplorer: ['nodes', 'edges', 'legend'], FormSection: ['formId', 'fields', 'submitLabel'],
  DiscussionFeed: ['items'], BenefitsRow: ['items'], DirectoryLinks: ['groups'], Newsletter: ['title'], DetailHeader: ['title', 'media'], AccountPanel: ['mode'],
  AdminPanel: ['entity'], SearchResults: ['query', 'items'], AuthForm: ['mode']
};

const hash = s => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const pick = (arr, seed) => arr[seed % arr.length];
const CATALOG_OF = { blog: 'blog', riscos: 'riscos', apps: 'apps', ferramentas: 'ferramentas', loja: 'loja', mapas: 'mapas', cases: 'cases', comunidade: 'comunidade' };
const KICK = { blog: 'formato', ferramentas: 'tipo', loja: 'categoria', apps: 'perfil', mapas: 'perfil', riscos: null, cases: null };

function demoItems(cat, n = 12) {
  return Array.from({ length: n }, (_, k) => {
    const s = hash(cat + k);
    const f = Object.fromEntries(Object.entries(ECO.FACETS).map(([key, d]) => [key, pick(d.values, s >> (key.length % 5))]));
    f.formato = pick(ECO.FACETS.formato.values, s + k); f.disponibilidade = k % 3 ? 'gratuito' : 'pago';
    const kk = KICK[cat];
    return {
      slug: 'exemplo-' + (k + 1), facets: f, href: ECO.DETAIL[cat] + 'exemplo-' + (k + 1),
      title: `Lorem ipsum dolor ${k + 1}`, kicker: kk ? ECO.label(f[kk]) : 'Lorem ipsum', category: 'Lorem ipsum · ' + (kk ? ECO.label(f[kk]) : 'exemplo'),
      meta: [ECO.label(f.perfil), ECO.label(f.disponibilidade)].join(' · ')
    };
  });
}
function filtered(cat, query) {
  return demoItems(cat).filter(it => Object.entries(query).every(([k, v]) => k === 'pagina' ? true : k === 'q' ? (it.title + ' lorem ipsum').toLowerCase().includes(v.toLowerCase()) : it.facets[k] === v));
}
const lorem = (k = 0) => [LOREM.p, LOREM.p2, LOREM.p3][k % 3];
const media = (kind, alt = '') => ({ kind, alt });
const related = (n = 3, base = '/blog/', kicker = 'Lorem') => Array.from({ length: n }, (_, k) => ({ href: base + 'exemplo-' + (k + 1), kicker: kicker + ' ' + (k + 1), title: 'Lorem ipsum dolor sit amet consectetur', cta: 'Lorem ipsum' }));

// Per-type default props for a route. Overridden per template below.
function propsFor(type, ctx) {
  const { page, res, site, idx } = ctx;
  const title = res.slug ? 'Lorem ipsum dolor sit amet.' : page.title;
  switch (type) {
    case 'HeroCampaign': return { title, description: LOREM.s, media: media('hero'), actions: [{ label: 'Lorem ipsum', href: '/studio/briefing' }], theme: 'alt', headingLevel: 1 };
    case 'FeatureSplit': return { eyebrow: 'Lorem ipsum', title: LOREM.t2, body: lorem(idx), media: media('landscape'), alignment: idx % 2 ? 'right' : 'left' };
    case 'PromoGrid': return { items: ['sobre', 'metodologia', 'cases', 'briefing'].map((id, k) => ({ title: ECO.byId[id].title, description: LOREM.s, theme: ['alt', 'dark', 'dark', 'alt'][k], actions: [{ label: 'Saiba mais', href: ECO.byId[id].url }] })) };
    case 'PageIntro': return { title, description: LOREM.s, variant: 'showroom' };
    case 'ResourceGrid': return { items: [], variant: 'editorial' };
    case 'ArticleHeader': return { kicker: res.slug ? page.title : null, title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', publishedAt: '00 de mês de 2026', authors: ['Lorem Ipsum'], readingMinutes: 6 };
    case 'RichText': return { content: [{ t: 'p', text: LOREM.p }, { t: 'p', text: LOREM.p2 }, { t: 'h2', text: LOREM.t2 }, { t: 'p', text: LOREM.p3 }] };
    case 'MediaFigure': return { media: media('cover'), caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' };
    case 'EvidenceList': return { items: [1, 2, 3].map(k => `Lorem, I.; Dolor, S. (20${18 + k}). Lorem ipsum dolor sit amet. Periódico, 00(0), 000–000. doi:00.0000/exemplo.${k}`) };
    case 'RelatedContent': return { title: 'Continue lendo', items: related(3), variant: 'cards' };
    case 'DiscussionFeed': return { title: 'Comentários', items: [1, 2, 3].map(k => ({ author: 'Lorem Ipsum ' + k, date: '00/00/2026', text: LOREM.p.slice(0, 140) + '.' })) };
    case 'BenefitsRow': return { title: 'Lorem ipsum dolor sit amet.', items: [['ph-brain', 'Lorem ipsum'], ['ph-path', 'Dolor sit amet'], ['ph-book-open-text', 'Consectetur']].map(([icon, t]) => ({ icon, title: t, description: LOREM.s, more: LOREM.p.slice(0, 160) + '.' })) };
    case 'DirectoryLinks': return { title, groups: [] };
    case 'Newsletter': return { title: 'Lorem ipsum newsletter.', description: LOREM.s };
    case 'DetailHeader': return { title, description: LOREM.p.slice(0, 160) + '.', media: media('square'), actions: [] };
    case 'FormSection': return { formId: page.id, title: null, fields: [{ name: 'nome', label: 'Nome', required: true }, { name: 'email', label: 'E-mail', type: 'email', required: true }, { name: 'mensagem', label: 'Mensagem', rows: 4, required: true }], submitLabel: 'Enviar' };
    case 'MapExplorer': return mapData(page.id);
    case 'SearchResults': return { query: res.query.q || '', items: res.query.q ? ['blog', 'ferramentas', 'mapas'].flatMap(c => filtered(c, { q: res.query.q }).slice(0, 2).map(it => ({ ...it, kicker: ECO.byId[c].title, url: it.href }))) : [] };
    case 'AccountPanel': return { mode: 'resumo' };
    case 'AuthForm': return { mode: 'entrar', returnTo: '/minha-conta' };
    case 'AdminPanel': return { entity: page.title };
    case 'FilterBar': return { facets: (page.filters || []).filter(f => ECO.FACETS[f]).map(f => ({ key: f, ...ECO.FACETS[f] })), query: res.query };
    default: return {};
  }
}

function mapData(seed) {
  const groups = [{ key: 'a', label: 'Funções executivas' }, { key: 'b', label: 'Regiões' }, { key: 'c', label: 'Riscos' }, { key: 'd', label: 'Estratégias' }];
  const pts = [[50, 48], [24, 26], [76, 24], [18, 70], [82, 68], [40, 82], [62, 84], [36, 12], [64, 50], [30, 48]];
  const nodes = pts.map(([x, y], k) => ({ id: 'n' + k, label: 'Lorem ' + (k + 1), group: groups[k % 4].key, x, y }));
  const edges = [[0, 1], [0, 2], [0, 8], [0, 9], [1, 7], [2, 7], [3, 9], [4, 8], [5, 9], [6, 8], [5, 6], [3, 5], [4, 6]].map(([a, b]) => ['n' + a, 'n' + b]);
  return { nodes, edges, legend: groups, initialSelection: 'n0' };
}

function showroomProps(type, ctx) {
  const { page, res } = ctx;
  const cat = CATALOG_OF[page.id];
  const railKey = { ferramentas: 'tipo', loja: 'categoria', apps: 'perfil' }[page.id];
  const tabKey = { ferramentas: 'objetivo', loja: 'disponibilidade', apps: 'colecao' }[page.id];
  const all = filtered(cat, res.query);
  const per = 9, pages = Math.max(1, Math.ceil(all.length / per)), pg = Math.min(pages, +res.query.pagina || 1);
  switch (type) {
    case 'PageIntro': return { title: page.title, description: null, variant: 'showroom', links: [['Lorem ipsum dolor', '/studio/briefing'], ['Como usar este catálogo', null]] };
    case 'CategoryRail': return { items: ECO.FACETS[railKey].values.map(v => ({ value: v, label: ECO.label(v), href: ECO.withQuery(page.url, { [railKey]: v }) })), activeValue: res.query[railKey] };
    case 'FeaturedCarousel': return { label: 'Lorem ipsum novidades.', items: demoItems(cat, 5).map(it => ({ ...it, kicker: 'Novo', description: LOREM.s })) };
    case 'CollectionTabs': return tabKey === 'colecao'
      ? { title: 'Lorem ipsum coleções.', stateKey: 'colecao', items: ['Lorem', 'Ipsum', 'Dolor'].map(l => ({ value: l.toLowerCase(), label: l + ' ipsum' })) }
      : { title: 'Lorem ipsum coleções.', stateKey: tabKey, items: ECO.FACETS[tabKey].values.map(v => ({ value: v, label: ECO.label(v) })) };
    case 'ResourceGrid': return { items: all.slice((pg - 1) * per, pg * per), total: all.length, variant: 'mosaic', pagination: { page: pg, pages } };
    case 'BenefitsRow': return { ...propsFor('BenefitsRow', ctx), title: 'Lorem ipsum dolor sit amet consectetur.' };
    case 'DirectoryLinks': return { title: page.title, groups: [
      { title: 'Filtrar por perfil', big: true, links: ECO.FACETS.perfil.values.map(v => [ECO.label(v), ECO.withQuery(page.url, { perfil: v })]) },
      { title: 'Filtrar por objetivo', links: ECO.FACETS.objetivo.values.map(v => [ECO.label(v), ECO.withQuery(page.url, { objetivo: v })]) },
      { title: 'Explorar mais', links: [['Loja e marketplace', '/loja'], ['Apps', '/apps'], ['Ferramentas', '/ferramentas'], ['Comunidade', '/comunidade']].filter(([, u]) => u !== page.url) }
    ] };
    case 'FilterBar': return propsFor(type, ctx);
  }
}

// Template-level ids + overrides. Returns null to keep defaults.
function recipe(res, site) {
  const page = res.page, bp = res.bp, t = page.template;
  const types = [...bp.blocks];
  const ids = {
    landing: ['inicio', 'mapa', 'app', 'explore', 'leitura', 'newsletter'],
    conteudo: ['titulo', 'capa', 'introducao', 'midia', 'corpo', 'referencias', 'relacionados', 'comentarios'],
    produto_app: ['titulo', 'funcionalidades', 'como-funciona', 'beneficios', 'relacionados'],
    recurso: ['titulo', 'preview', 'instrucoes', 'relacionados'], produto: ['titulo', 'imagens', 'descricao', 'relacionados'],
    risco: ['titulo', 'descricao', 'fontes', 'relacionados'], mapa_interativo: ['titulo', 'exploracao', 'referencias', 'relacionados'],
    topico: ['titulo', 'publicacao', 'respostas', 'responder'], formulario: ['titulo', 'formulario']
  }[t];
  if (t === 'produto_app') types.push('PageIntro');
  if (page.id === 'contato') types.push('DirectoryLinks');
  const seen = {};
  const anyFilter = Object.keys(res.query).some(k => k !== 'pagina');
  const blocks = types.map((type, idx) => {
    let id = (ids && ids[idx]) || type.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    if (seen[id]) id += '-' + (++seen[id]); else seen[id] = 1;
    const ctx = { page, res, site, idx };
    let props = (ECO.PATTERN[t] === 'showroom' && CATALOG_OF[page.id] && ['apps', 'ferramentas', 'loja'].includes(page.id) && showroomProps(type, ctx)) || propsFor(type, ctx);
    props = override(t, page, type, id, idx, props, res, site);
    if (props === null) return null;
    let surface = null;
    if (['CollectionTabs', 'FilterBar', 'ResourceGrid'].includes(type) && ['apps', 'ferramentas', 'loja'].includes(page.id)) surface = 'alt';
    if (type === 'DirectoryLinks' && page.id !== 'contato') surface = 'alt2';
    if (type === 'Newsletter' || (type === 'DiscussionFeed' && t === 'conteudo') || (type === 'RelatedContent' && t !== 'landing' && t !== 'catalogo_conteudos')) surface = 'alt';
    return { id, type, version: 1, props, surface };
  });
  const kept = blocks.filter(Boolean);
  return anyFilter ? kept.filter(b => b.type !== 'FeaturedCarousel') : kept;
}

// Artigos do CMS (apps/site/content/articles → articles.js). Ausentes no Claude Design: tudo segue em lorem.
const ARTICLES = window.ECO_ARTICLES || [];
const articleBySlug = slug => ARTICLES.find(a => a.slug === slug);
const ASSET = src => '../../assets/' + src;
const FORMAT_LABEL = { article: 'Artigo', manifesto: 'Manifesto' };
const articleItem = a => ({ slug: a.slug, href: '/blog/' + a.slug, title: a.title, kicker: FORMAT_LABEL[a.contentType] || 'Artigo', category: (FORMAT_LABEL[a.contentType] || 'Artigo') + ' · ' + a.tags.slice(0, 2).join(' · '), meta: a.readingMinutes + ' min · ' + a.tags[0], description: a.description, media: a.cover && { src: ASSET(a.cover.src), alt: a.cover.alt } });

// Mini apps PWA (apps/miniapps/catalog.json → miniapps.js, gerado por apps/site/build.mjs). Sem eles, os catálogos seguem em lorem.
const MINIAPPS = window.ECO_MINIAPPS || [];
const miniBySlug = slug => MINIAPPS.find(m => m.slug === slug);
const miniHref = m => '/' + m.catalog + '/' + m.slug;
const miniMatch = (m, q) => Object.entries(q).every(([k, v]) => k === 'pagina' || k === 'colecao' ? true
  : k === 'q' ? (m.title + ' ' + m.description).toLowerCase().includes(v.toLowerCase())
  : k === 'disponibilidade' ? v === 'gratuito' : (m.facets[k] || []).includes(v));
const miniItem = m => ({ slug: m.slug, href: miniHref(m), real: true, title: m.title, kicker: m.kicker, category: (m.catalog === 'apps' ? 'App' : 'Ferramenta') + ' · ' + m.kicker, meta: 'Gratuito · offline · sem conta', description: m.description, media: { src: m.icon, alt: '', icon: true } });

const MINI_BENEFITS = { title: 'Feito para funcionar em qualquer lugar.', items: [
  { icon: 'ph-wifi-slash', title: 'Offline', description: 'Abre e salva sem conexão.', more: 'Depois da primeira visita, todos os mini apps ficam guardados no navegador e funcionam sem internet.' },
  { icon: 'ph-user-circle-dashed', title: 'Sem conta', description: 'O plano fica no seu aparelho.', more: 'Nada é enviado a servidores. Para levar o plano a outro aparelho, exporte o arquivo JSON no Prisma.' },
  { icon: 'ph-device-mobile', title: 'Instalável', description: 'Vira um app na tela de início.', more: 'No celular, use “Adicionar à tela de início”. No computador, o ícone de instalar na barra de endereço.' }
] };

function miniCatalogOverride(page, type, p, res) {
  const mine = MINIAPPS.filter(m => m.catalog === page.id);
  if (type === 'PageIntro') return { ...p, description: page.id === 'apps'
    ? 'Apps que funcionam no navegador, sem conta e mesmo sem conexão. Todos usam o mesmo plano salvo no seu aparelho.'
    : 'Ferramentas gratuitas para levar o plano para o papel e trazer planos de outras fontes.', links: [['Todos os mini apps', '/m/'], ['Executar App', '/apps/executar']] };
  if (type === 'FeaturedCarousel') return { label: 'Novos: mini apps locais.', items: MINIAPPS.map(miniItem).map(it => ({ ...it, kicker: 'Novo · ' + it.kicker })) };
  if (type === 'ResourceGrid') { const items = mine.filter(m => miniMatch(m, res.query)).map(miniItem); return { items, total: items.length, variant: 'mosaic', pagination: { page: 1, pages: 1 } }; }
  if (type === 'BenefitsRow') return MINI_BENEFITS;
  return p;
}

function miniDetailOverride(m, type, id, p) {
  const open = { label: 'Abrir ' + m.title, href: '/m/' + m.slug + '/' };
  const others = MINIAPPS.filter(x => x.slug !== m.slug).slice(0, 3).map(x => ({ href: miniHref(x), kicker: x.kicker, title: x.title, cta: 'Ver detalhes' }));
  if (type === 'DetailHeader') return { ...p, kicker: (m.catalog === 'apps' ? 'App' : 'Ferramenta') + ' · gratuito', title: m.name, description: m.description, media: { kind: 'square', src: m.icon, alt: '', icon: true }, actions: [open, { label: 'Todos os mini apps', href: '/m/' }], note: 'Funciona no navegador, offline e sem conta. O plano fica salvo neste aparelho e é o mesmo em todos os mini apps.' };
  if (id === 'funcionalidades' || type === 'FeatureSplit') return { ...p, eyebrow: 'Funcionalidades', title: m.features.join(' · ') + '.', body: m.description, media: { kind: 'landscape', src: m.icon, alt: '', icon: true } };
  if (type === 'MediaFigure') return { media: { kind: 'landscape', src: m.icon, alt: m.title, icon: true }, caption: m.name };
  if (id === 'como-funciona' || id === 'instrucoes' || type === 'RichText') return { content: [
    { t: 'h2', text: 'Como usar' },
    { t: 'p', text: 'Abra o app pelo botão acima. Ele roda direto no navegador, sem cadastro. Depois da primeira visita, continua funcionando sem conexão.' },
    { t: 'p', text: 'Para instalar no celular, use “Adicionar à tela de início” no menu do navegador. No computador, use o ícone de instalar na barra de endereço.' },
    { t: 'p', text: 'Os seis mini apps compartilham o mesmo plano salvo neste aparelho: crie no Prisma, execute no Executar, acompanhe no Mapa e nas Rotinas e imprima nas Folhas A4.' }
  ] };
  if (type === 'BenefitsRow') return MINI_BENEFITS;
  if (type === 'RelatedContent') return { title: 'Outros mini apps', items: others, variant: 'cards' };
  if (type === 'PageIntro') return { variant: 'cta', title: 'Abra o ' + m.title + '.', description: m.description, actions: [open, { label: 'Ver todos', href: '/' + m.catalog }], note: null };
  return p;
}

function articleOverride(a, type, id, p) {
  if (type === 'ArticleHeader') return { kicker: (FORMAT_LABEL[a.contentType] || 'Artigo') + ' · ' + a.tags.slice(0, 3).join(' · '), title: a.title, publishedAt: 'Pronto para revisão', authors: null, readingMinutes: a.readingMinutes };
  if (id === 'capa') return { media: a.cover ? { kind: 'cover', src: ASSET(a.cover.src), alt: a.cover.alt } : media('cover'), caption: a.cover && a.cover.caption };
  if (id === 'introducao') return { content: [{ t: 'p', text: a.description }] };
  if (id === 'midia') return null; // as figuras entram no corpo, na seção indicada pelos anexos
  if (id === 'corpo') return { content: a.segments.filter(s => !(s.t === 'panel' && s.kind === 'evidence')).map(s => (s.t === 'figure' ? { ...s, src: ASSET(s.src) } : s)) };
  if (type === 'EvidenceList') return { title: 'Referências científicas', items: a.sources, real: true };
  if (type === 'RelatedContent') return { title: 'Continue lendo', variant: 'cards', items: ARTICLES.filter(x => x.slug !== a.slug).slice(0, 3).map(x => ({ href: '/blog/' + x.slug, kicker: FORMAT_LABEL[x.contentType] || 'Artigo', title: x.title, cta: 'Ler artigo' })) };
  return p;
}

function override(t, page, type, id, idx, p, res, site) {
  if ((page.id === 'apps' || page.id === 'ferramentas') && MINIAPPS.some(m => m.catalog === page.id)) return miniCatalogOverride(page, type, p, res);
  if ((t === 'produto_app' || t === 'recurso') && res.slug && miniBySlug(res.slug)) return miniDetailOverride(miniBySlug(res.slug), type, id, p);
  if (t === 'produto_app' && !res.slug && miniBySlug('prisma')) {
    const open = { label: 'Abrir o Prisma', href: '/m/prisma/' };
    if (type === 'DetailHeader') return { ...p, kicker: 'App · gratuito', title: 'Executar App', description: 'Planeje em três horizontes, execute uma ação por vez e leve o plano para o papel. Seis mini apps que funcionam no navegador, offline e sem conta.', media: { kind: 'square', src: miniBySlug('prisma').icon, alt: '', icon: true }, actions: [open, { label: 'Como funciona', href: '/apps/executar#como-funciona' }], note: null };
    if (id === 'funcionalidades') return { ...p, eyebrow: 'Funcionalidades', title: 'Seis apps. Um plano.', body: MINIAPPS.map(m => m.title + ': ' + m.description).join(' ') };
    if (id === 'como-funciona') return { content: [
      { t: 'h2', text: 'Como funciona' },
      { t: 'p', text: 'Comece pelo Prisma: oito perguntas montam os entregáveis em Agora, Próximo e Depois, cada um com prova de conclusão.' },
      { t: 'p', text: 'Na hora de fazer, o Executar mostra uma ação por vez com timer. O Mapa mental e as Rotinas acompanham o mesmo plano, e as Folhas A4 o levam para o papel. Nenhuma tarefa é marcada como feita sem você.' },
      { t: 'p', text: 'Tudo fica salvo no seu aparelho. Não precisa de conta e funciona sem conexão depois da primeira visita.' }
    ] };
    if (type === 'RelatedContent') return { title: 'Os mini apps', items: MINIAPPS.map(m => ({ href: miniHref(m), kicker: m.kicker, title: m.title, cta: 'Ver detalhes' })), variant: 'cards' };
    if (type === 'PageIntro') return { variant: 'cta', title: 'Acesse o Executar App.', description: 'Abra o Prisma e crie seu primeiro plano em poucos minutos.', actions: [open, { label: 'Todos os mini apps', href: '/m/' }], note: null };
  }
  if (t === 'conteudo' && page.id === 'conteudo' && articleBySlug(res.slug)) return articleOverride(articleBySlug(res.slug), type, id, p);
  if (t === 'catalogo_conteudos' && ARTICLES.length) {
    if (type === 'RelatedContent') { const a = ARTICLES[0]; return { variant: 'featured', items: [{ href: '/blog/' + a.slug, kicker: 'Destaque', title: a.title, description: a.description, media: a.cover && { src: ASSET(a.cover.src), alt: a.cover.alt } }] }; }
    if (type === 'ResourceGrid') {
      const q = res.query;
      const all = ARTICLES.map(articleItem)
        .filter(it => !q.q || it.title.toLowerCase().includes(q.q.toLowerCase()))
        .filter(() => !q.formato || q.formato === 'artigo');
      return { items: all, total: all.length, variant: 'editorial', pagination: { page: 1, pages: 1 } };
    }
  }
  if (t === 'landing') {
    if (id === 'inicio') return { ...p, title: site.name, description: 'Lorem ipsum dolor sit amet.', actions: [{ label: 'Explorar o mapa', href: '/mapa-cognitivo' }, { label: 'Conhecer o projeto', href: '/sobre' }], theme: 'light', headingLevel: 1 };
    if (id === 'mapa') return { ...p, title: 'Mapa cognitivo', description: 'Lorem ipsum dolor sit amet.', actions: [{ label: 'Explorar', href: '/mapa-cognitivo' }, { label: 'Todos os mapas', href: '/mapas' }], theme: 'dark', headingLevel: 2 };
    if (id === 'app') return { ...p, title: 'Executar App', description: 'Lorem ipsum dolor sit amet.', actions: [{ label: 'Saiba mais', href: '/apps/executar' }, { label: 'Como funciona', href: '/apps/executar#como-funciona' }], theme: 'alt', headingLevel: 2 };
    if (type === 'PromoGrid') return { items: ['blog', 'riscos', 'ferramentas', 'studio'].map((rid, k) => ({ title: ECO.byId[rid].title, description: LOREM.s, theme: ['alt', 'dark', 'dark', 'alt'][k], actions: [{ label: 'Saiba mais', href: ECO.byId[rid].url }] })) };
    if (type === 'RelatedContent') return { title: null, variant: 'rail', items: related(5, '/blog/', 'Lorem').map((it, k) => ({ ...it, kicker: ECO.label(ECO.FACETS.formato.values[k]) })) };
  }
  if (t === 'catalogo_conteudos' || t === 'catalogo_riscos' || t === 'catalogo_mapas' || t === 'catalogo_projetos') {
    const cat = CATALOG_OF[page.id] || 'blog';
    if (type === 'RelatedContent') return { variant: 'featured', items: [{ href: '/blog/exemplo-1', kicker: 'Destaque', title: LOREM.t2, description: LOREM.s }] };
    if (type === 'ResourceGrid') { const all = filtered(cat, res.query); const per = 9, pages = Math.max(1, Math.ceil(all.length / per)), pg = Math.min(pages, +res.query.pagina || 1); return { items: all.slice((pg - 1) * per, pg * per), total: all.length, variant: t === 'catalogo_projetos' ? 'people' : 'editorial', pagination: { page: pg, pages } }; }
    if (type === 'EvidenceList') return { ...p, title: 'Fontes' };
  }
  if (t === 'comunidade') {
    if (type === 'FilterBar') return { facets: [{ key: 'tipo', label: 'Tipo', values: ECO.COMMUNITY_TIPO }], query: res.query };
    if (type === 'DiscussionFeed') {
      const items = Array.from({ length: 8 }, (_, k) => ({ author: 'Lorem Ipsum ' + (k + 1), date: '00/00/2026', tipo: ECO.COMMUNITY_TIPO[k % 4], title: 'Lorem ipsum dolor sit amet ' + (k + 1) + '?', href: '/comunidade/topicos/exemplo-' + (k + 1), text: LOREM.p.slice(0, 120) + '.', replies: (k * 3) % 11 }))
        .filter(it => !res.query.tipo || it.tipo === res.query.tipo).filter(it => !res.query.q || it.title.toLowerCase().includes(res.query.q.toLowerCase()));
      return { title: null, items, allowPosting: true, mode: 'feed' };
    }
  }
  if (t === 'conteudo') {
    if (id === 'capa') return { media: media('cover'), caption: null };
    if (id === 'introducao') return { content: [{ t: 'p', text: LOREM.p }, { t: 'p', text: LOREM.p2 }, { t: 'strong', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?' }, { t: 'q', by: 'Lorem Ipsum', text: LOREM.p3 }, { t: 'p', text: LOREM.p }] };
    if (id === 'midia') return { media: media('cover'), caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', link: ['Ver recurso relacionado', '/ferramentas/exemplo-1'] };
    if (id === 'corpo') return { content: [{ t: 'strong', text: 'Lorem ipsum dolor sit amet consectetur?' }, { t: 'q', by: 'Lorem Ipsum', text: LOREM.p2 }, { t: 'p', text: LOREM.p }, { t: 'p', text: LOREM.p3 }, { t: 'h2', text: 'Continue lendo' }, { t: 'p', text: LOREM.s }] };
  }
  if (t === 'risco' && type === 'EvidenceList') return { ...p, title: 'Fontes' };
  if (t === 'case' && type === 'ArticleHeader') return { ...p, kicker: 'Projeto' };
  if (t === 'topico') {
    if (type === 'ArticleHeader') return { ...p, kicker: 'Comunidade', readingMinutes: null };
    if (type === 'DiscussionFeed') return { title: 'Respostas', items: [1, 2].map(k => ({ author: 'Lorem Ipsum ' + k, date: '00/00/2026', text: LOREM.p2.slice(0, 130) + '.' })) };
    if (type === 'FormSection') return { formId: 'resposta', title: 'Responder', consent: false, fields: [{ name: 'resposta', label: 'Sua resposta', rows: 4, required: true }], submitLabel: 'Publicar resposta' };
  }
  if (t === 'produto_app') {
    if (type === 'DetailHeader') return { ...p, kicker: 'App', title: res.slug ? 'Lorem ipsum app' : 'Executar App', media: media('square'), actions: [{ label: 'Acessar o aplicativo', reason: 'URL real do aplicativo a configurar' }, { label: 'Como funciona', href: page.url.replace('[slug]', res.slug) + '#como-funciona' }], note: 'Acesso desativado até a URL real do aplicativo ser configurada no CMS.' };
    if (id === 'funcionalidades') return { ...p, eyebrow: 'Funcionalidades', title: LOREM.t2 };
    if (id === 'como-funciona') return { content: [{ t: 'h2', text: 'Como funciona' }, { t: 'p', text: LOREM.p }, { t: 'p', text: LOREM.p2 }] };
    if (type === 'RelatedContent') return { title: 'Outros apps', items: related(3, '/apps/', 'App'), variant: 'cards' };
    if (type === 'PageIntro') return { variant: 'cta', title: 'Acesse o Executar App.', description: LOREM.s, actions: [{ label: 'Acessar o aplicativo', reason: 'URL real a configurar' }], note: 'Destino externo não inventado: configure a URL real antes de ativar.' };
  }
  if (t === 'produto' && type === 'DetailHeader') return { ...p, kicker: 'Loja', actions: [{ label: 'Comprar', reason: 'Checkout ou link de afiliado a configurar' }], note: 'Preço exibido somente quando informado no CMS. Checkout/afiliado a configurar.' };
  if (t === 'recurso' && type === 'DetailHeader') return { ...p, kicker: 'Recurso', actions: [{ label: 'Baixar', reason: 'Permissão de download a configurar' }, { label: 'Ver na loja', href: '/loja' }], note: 'Download de recursos pagos controlado pelo CMS.' };
  if ((t === 'produto' || t === 'recurso') && type === 'RelatedContent') return { title: 'Relacionados', items: related(3, t === 'produto' ? '/loja/' : '/ferramentas/', 'Lorem'), variant: 'cards' };
  if (t === 'recurso' && type === 'MediaFigure') return { media: media('cover'), caption: 'Pré-visualização · lorem ipsum.' };
  if (t === 'recurso' && type === 'RichText') return { content: [{ t: 'h2', text: 'Instruções' }, { t: 'p', text: LOREM.p }, { t: 'p', text: LOREM.p2 }] };
  if (t === 'institucional' || t === 'servicos') {
    if (type === 'PageIntro') return { ...p, variant: 'center', description: LOREM.s };
    if (type === 'FeatureSplit') return { ...p, media: media(page.id === 'autor' || page.id === 'parceiros' ? 'portrait' : 'landscape') };
    if (type === 'RichText') return { content: [{ t: 'p', text: LOREM.p }, { t: 'p', text: LOREM.p2 }] };
    if (type === 'RelatedContent') return { title: 'Lorem ipsum', items: ECO.GROUPS[0].items.filter(([i]) => i !== page.id).slice(0, 3).map(([i]) => ({ href: ECO.byId[i].url, kicker: 'Conheça', title: ECO.byId[i].title })), variant: 'cards' };
  }
  if (t === 'servicos' && type === 'PromoGrid') return { items: ['consultoria', 'studio_servicos', 'cases', 'briefing'].map((rid, k) => ({ title: ECO.byId[rid].title, description: LOREM.s, theme: ['alt', 'dark', 'dark', 'alt'][k], actions: [{ label: 'Saiba mais', href: ECO.byId[rid].url }] })) };
  if (t === 'servico') {
    if (type === 'HeroCampaign') return { ...p, actions: [{ label: 'Contato e briefing', href: '/studio/briefing' }, { label: 'Projetos e casos', href: '/studio/projetos' }] };
    if (type === 'RelatedContent') return { title: 'Projetos e casos', items: related(3, '/studio/projetos/', 'Projeto'), variant: 'cards' };
  }
  if (t === 'mapa_interativo' && type === 'RelatedContent') return { title: 'Todos os mapas', items: [['mapa', '/mapa-cognitivo'], ['mapa_neuro', '/mapas/neurodivergencia'], ['mapa_projetos', '/mapas/projetos-e-processos']].filter(([i]) => i !== page.id).map(([i, u]) => ({ href: u, kicker: 'Mapa', title: ECO.byId[i].title })).concat([{ href: '/mapas', kicker: 'Catálogo', title: 'Todos os mapas' }]), variant: 'cards' };
  if (t === 'formulario' && type === 'FormSection') {
    if (page.id === 'newsletter') return { ...p, fields: [{ name: 'email', label: 'E-mail', type: 'email', required: true }], submitLabel: 'Inscrever' };
    if (page.id === 'briefing') return { ...p, fields: [{ name: 'nome', label: 'Nome', required: true }, { name: 'email', label: 'E-mail', type: 'email', required: true }, { name: 'empresa', label: 'Empresa ou projeto' }, { name: 'briefing', label: 'Briefing', rows: 6, required: true }], submitLabel: 'Enviar briefing' };
  }
  if (page.id === 'contato' && type === 'DirectoryLinks') return { title: 'Redes sociais', groups: [{ title: 'Perfis oficiais', links: [['Instagram', null], ['LinkedIn', null], ['YouTube', null]] }] };
  return p;
}

function BlockError({ b, msg }) {
  return <div className="eco-wrap"><div className="eco-block-error" role="alert"><b>{b.type}#{b.id}</b> — {msg}</div></div>;
}

function BlockRenderer({ blocks }) {
  return blocks.map((b, k) => {
    const C = REGISTRY[b.type];
    let body;
    if (C === undefined) body = <BlockError b={b} msg="tipo desconhecido no registry" />;
    else if (b.version !== 1) body = <BlockError b={b} msg={'versão ' + b.version + ' não suportada'} />;
    else {
      const miss = (REQUIRED[b.type] || []).filter(r => b.props[r] == null);
      body = miss.length ? <BlockError b={b} msg={'props obrigatórias ausentes: ' + miss.join(', ')} /> : <C id={b.id} first={k === 0} {...b.props} />;
    }
    return (
      <section key={b.id} id={b.id} data-block={b.type} className={'eco-block' + (b.surface ? ' s-' + b.surface : '')}>
        <span className="eco-block-label">{b.type}#{b.id}</span>
        {body}
      </section>
    );
  });
}

function RoutePage() {
  const { res, site } = useEco();
  const blocks = React.useMemo(() => res.page ? recipe(res, site) : [], [res, site]);
  if (res.pattern === 'notfound') return (
    <section className="eco-block"><div className="eco-wrap eco-gate"><p className="eco-kicker">404</p><h1 className="eco-showroom-title">Página não encontrada.</h1><p className="eco-lead">Rota ou slug inexistente/não publicado: <code>{res.path}</code></p><Actions actions={[{ label: 'Ir para o início', href: '/' }, { label: 'Busca', href: '/busca' }]} /></div></section>
  );
  return <BlockRenderer blocks={blocks} />;
}

Object.assign(window, { REGISTRY, REQUIRED, recipe, BlockRenderer, RoutePage, demoItems });
