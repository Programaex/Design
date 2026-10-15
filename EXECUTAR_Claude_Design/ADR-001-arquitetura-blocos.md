# ADR-001 — EXECUTAR: arquitetura de páginas por blocos

**Data:** 15/10/2026 • **Status:** proposto para implementação no Claude Design • **Versão:** 1.0

## 1. Contexto e resultado esperado

Construir o ecossistema EXECUTAR com a composição visual das três referências indicadas pelo usuário, preservando o sitemap definido na conversa. O trabalho é uma reprodução estrutural da experiência: hierarquia, proporções, ritmo, navegação, blocos, cards e leitura. Marca, textos, produtos e imagens serão do EXECUTAR. Nesta etapa, usar os placeholders locais fornecidos.

O pacote contém especificação e evidências visuais; não contém um site já implementado. As capturas registram o estado desktop observado. A arquitetura interna, o CMS e o backend da Apple não são públicos nesta inspeção: a arquitetura de software abaixo é uma proposta para o EXECUTAR, não uma afirmação sobre a implementação da Apple.

## 2. Referências e limites da observação

| ID | Referência | Padrão observado | Aplicação |
|---|---|---|---|
| REF-01 | https://www.apple.com/br/ | Navegação compacta; grandes campanhas verticais; dupla de CTAs; mosaico de duas colunas; galeria; rodapé em diretório | Home, institucional, apresentação do app, serviços |
| REF-02 | https://developer.apple.com/news/?id=to37r18t | Artigo em coluna central; título e data; imagem de abertura; texto e imagens intercalados; divisores; continuidade de leitura; compartilhamento | Artigos, guias, ciência e casos |
| REF-03 | https://www.apple.com/br/shop/accessories/all | Título amplo; categorias ilustradas; destaque em carrossel; abas; grade de produtos com cards de tamanhos diferentes; benefícios; diretório de categorias | Ferramentas, Apps, Loja e catálogos |

REF-02 é uma página de artigo. O índice `/blog` será uma derivação editorial proposta, e não uma cópia de uma listagem observada nessa URL. Mapas, riscos cognitivos, comunidade e administração também são adaptações do projeto.

As capturas completas estão em `referencias/`. Home e showroom foram capturados com fullPage; o artigo foi composto com capturas sobrepostas e coordenadas de rolagem porque a captura única excedeu o tempo limite. Os PNGs foram convertidos de capturas JPEG; a conversão não acrescenta resolução. Carrosséis e abas mostram o estado selecionado na captura, não todos os estados ocultos.

## 3. Decisão principal

Adotar **um shell global, três famílias visuais e um registro de blocos reutilizáveis**, com templates especializados para fluxos funcionais.

1. **Institucional:** grandes seções visuais, mensagens curtas, espaço amplo e uma ou duas ações.
2. **Editorial:** leitura contínua, largura contida, hierarquia tipográfica e mídia entre seções.
3. **Showroom:** descoberta por categorias, coleções e cards, com filtros persistidos na URL.

Mapas e áreas de conta/comunidade/admin usam blocos funcionais próprios e a mesma base tipográfica. Não converter um mapa interativo em uma imagem de marketing nem uma administração em uma landing page.

## 4. Arquitetura de navegação

### 4.1 Cabeçalho

Desktop: **EXECUTAR (logo) · Blog · Riscos cognitivos · Mapa cognitivo · Apps · Ferramentas · Busca · Conta · Hambúrguer**.

As seis entradas principais são `/`, `/blog`, `/riscos-cognitivos`, `/mapa-cognitivo`, `/apps` e `/ferramentas`. O logo ocupa a entrada da home. Não colocar Loja, Studio ou Sobre na faixa principal. O hambúrguer permanece disponível também no desktop.

Mobile: **logo · busca · hambúrguer**. O painel começa pelas seis entradas principais e depois apresenta o diretório completo. Conta fica disponível dentro do painel. No desktop, distribuir os grupos em colunas; no mobile, usar seções expansíveis com rótulos claros.

### 4.2 Grupos do hambúrguer

| Grupo | Destinos |
|---|---|
| Conheça o EXECUTAR | Sobre; autor; metodologia; editorial; parceiros |
| Conteúdos | Blog; artigo; guia; tutorial; vídeo; notícia; framework; evidência; curadoria |
| Cognição e mapas | Riscos cognitivos; mapa cognitivo; todos os mapas; neurodivergência; projetos e processos |
| Apps | Todos; Executar App; funcionalidades; como funciona; acessar |
| Ferramentas e recursos | Catálogo; IA e agentes; skills; prompts; photoprompts; workflows; templates; assets; e-books |
| Loja e marketplace | Catálogo; digitais; físicos; livros; cursos; afiliados |
| Comunidade | Discussões; perguntas; compartilhamentos; sugestões |
| Consultoria e Studio | Apresentação; consultoria; serviços; projetos; briefing |
| Utilidades | Busca; conta; newsletter; contato; redes sociais |

Usar o CSV para os URLs exatos. O mesmo destino pode aparecer no cabeçalho, no painel e no rodapé; isso não cria múltiplas páginas. Administração nunca entra no menu público.

## 5. Contrato das rotas

`EXECUTAR_rotas.csv` é a fonte de identidade, URL, hierarquia, acesso e navegação. `route-blueprints.json` acrescenta família visual, template de composição e blocos para as mesmas 78 entradas. Não renomear slugs, IDs ou pais silenciosamente.

| Tipo | Comportamento de implementação |
|---|---|
| `pagina` | Criar uma página real no endereço indicado |
| `dinamica` | Criar template com `[slug]`; carregar entidade; 404 para inexistente ou não publicada |
| `filtro` | Link com query string para catálogo existente; não criar outro arquivo de página |
| `ancora` | Link para seção com `id` no documento existente; não criar página |

Reservar `executar` em `/apps/[slug]`, e `neurodivergencia` e `projetos-e-processos` em `/mapas/[slug]`, respeitando as páginas explícitas. Os detalhes de artigo incluem `#referencias` e `#comentarios`; Executar App inclui `#funcionalidades`, `#como-funciona` e `#acesse`; contato inclui `#redes-sociais`.

Cada `[slug]` precisa de pelo menos um exemplo navegável no protótipo. Dados demonstrativos devem ser identificados como exemplos. Não criar resultados científicos, avaliações, preços ou depoimentos fictícios apresentados como reais.

### 5.1 Filtros e URLs

- `perfil`: tdah, dislexia, autismo, altas-habilidades, neurodivergencia.
- `objetivo`: estudar, trabalhar, rotina, projetos, processos.
- `formato` no Blog: artigo, guia, tutorial, video, noticia, framework, evidencia, curadoria.
- `tipo` em Ferramentas: ia-agentes, skills, prompts, photoprompts, workflows, templates, assets, ebooks.
- `tecnologia`: ia, agentes, skills, prompts, workflows, apps.
- `disponibilidade`: gratuito, pago.
- `categoria` na Loja: digitais, fisicos, livros, cursos, afiliados.
- `tipo` na Comunidade: discussoes, perguntas, compartilhamentos, sugestoes.

O CSV é amplo em alguns filtros compartilhados; a UI só deve oferecer facetas aplicáveis à entidade atual. Exemplo: não exibir filtro de preço em um catálogo sem valores. Busca usa `q`; paginação usa `pagina`, inteiro positivo com padrão 1. Aceitar apenas valores conhecidos; ignorar valores inválidos com estado estável. Combinar dimensões com AND. Nesta primeira versão, cada dimensão tem uma seleção. Ao alterar filtros, reiniciar paginação. Voltar/avançar do navegador deve restaurar o estado.

Rotas filtradas recebem `noindex,follow` e canonical para o catálogo base, seguindo o CSV. O sitemap XML contém apenas páginas públicas canônicas e slugs efetivamente publicados, sem colchetes literais, queries, âncoras, conta ou admin.

## 6. Biblioteca de blocos

O registro em `blocks.registry.json` define os contratos. Cada bloco tem `id` estável, `type`, `version: 1` e `props` validadas. Templates determinam ordem e limites; dados de conteúdo não carregam JSX, CSS arbitrário nem scripts.

| Bloco | Papel | Regra essencial |
|---|---|---|
| GlobalHeader / EcosystemMenu | Navegação compartilhada | Uma configuração para desktop, mobile e rodapé |
| HeroCampaign | Campanha ampla | Um título; descrição curta; até duas ações; mídia local |
| FeatureSplit | Texto e imagem | Alternância por variante, sem duplicar componente |
| PromoGrid | Mosaico institucional | Duas colunas no desktop; uma no celular |
| PageIntro | Introdução de seção | Título e descrição; ação auxiliar opcional |
| CategoryRail | Categorias ilustradas | Rolagem horizontal acessível no mobile |
| FeaturedCarousel | Destaques de showroom | Controles por teclado; sem autoplay por padrão |
| CollectionTabs | Seleção de coleção | Uma coleção ativa; sincronizada ao estado definido |
| ResourceGrid | Cards de recursos | Grade regular ou mosaico editorial controlado |
| FilterBar | Facetas e busca | Estado derivado dos parâmetros da URL |
| ArticleHeader / RichText / MediaFigure | Conteúdo editorial | Sem largura de linha excessiva; legenda e alt |
| EvidenceList / RelatedContent | Fontes e continuidade | Fontes reais; relação por dados |
| MapExplorer | Visualização funcional | Nós e arestas próprios; lista acessível equivalente |
| FormSection / DiscussionFeed | Participação | Estados de envio, erro, vazio e autenticação |
| BenefitsRow / DirectoryLinks | Orientação e descoberta | Links reais e promessa verificável |
| Newsletter / GlobalFooter | Fechamento compartilhado | Reutilizar configuração e formulário |
| DetailHeader / AccountPanel / AdminPanel | Fluxos específicos | Ações e permissões explícitas |

O registry é a lista permitida. Um tipo desconhecido deve produzir erro de validação no desenvolvimento, nunca sumir silenciosamente. O CMS pode reordenar blocos opcionais e editar conteúdo, mas não remover cabeçalho, H1, landmarks ou regras de acesso.

## 7. Receitas de página

### Home `/`

GlobalHeader → HeroCampaign EXECUTAR → HeroCampaign Mapa cognitivo → HeroCampaign Executar App → PromoGrid (Blog, Riscos, Ferramentas, Studio) → RelatedContent → Newsletter → GlobalFooter.

Preservar a hierarquia da REF-01: primeiro três grandes assuntos; depois mosaico; por fim descoberta e diretório. Alternar fundos claros e escuros em seções específicas. Não colocar todo o conteúdo dentro de cards arredondados ou acrescentar sidebar de dashboard.

### Blog `/blog`

GlobalHeader → PageIntro → FilterBar → RelatedContent em variante destaque → ResourceGrid editorial → paginação → Newsletter → GlobalFooter. A listagem é uma adaptação; compartilhar tipografia, espaçamento e tratamento de mídia com o artigo.

### Artigo `/blog/[slug]`

GlobalHeader → ArticleHeader → MediaFigure → RichText intercalado com MediaFigure → EvidenceList `referencias` → RelatedContent → DiscussionFeed `comentarios` → GlobalFooter.

Preservar a REF-02: título e metadados discretos, imagem de abertura alinhada à coluna, parágrafos legíveis, divisores sutis e continuidade. Metadados podem incluir autor e tempo de leitura, calculado a partir do conteúdo. Referências e comentários são extensões do EXECUTAR, não elementos alegadamente observados na página de referência.

### Showroom `/ferramentas`, `/apps`, `/loja`

GlobalHeader → PageIntro → CategoryRail → FeaturedCarousel → CollectionTabs → FilterBar → ResourceGrid → BenefitsRow → DirectoryLinks → GlobalFooter.

Preservar REF-03: título à esquerda, faixa de categorias, bloco grande de novidades, área de coleções com fundo neutro e cards de tamanhos variados. Em Ferramentas, as coleções por objetivo usam `objetivo`; na Loja, usar `categoria`; Apps pode usar coleção local sem criar rotas. Se houver filtro ou busca ativo, reduzir os destaques e priorizar resultados, mantendo uma ação para limpar filtros. Não esconder resultados após um longo conjunto de campanhas.

### Demais famílias

- Sobre e Studio: PageIntro, FeatureSplit, RichText, PromoGrid e CTA final, conforme o assunto.
- Riscos: PageIntro, catálogo de fatores, EvidenceList; detalhes usam receita editorial.
- Mapas: PageIntro, MapExplorer, legenda, referências e links relacionados.
- Detalhes de app/recurso/produto: DetailHeader, MediaFigure, descrição, instruções, recursos relacionados e CTA apropriado.
- Comunidade: PageIntro, filtros, DiscussionFeed; tópico inclui respostas e formulário.
- Conta/admin: shell funcional com formulário ou painel e autorização efetiva.

## 8. Tokens e comportamento responsivo

Os valores abaixo são **tokens propostos**, ajustáveis após comparação visual, não medidas extraídas do CSS da Apple.

| Token | Proposta |
|---|---|
| Fonte | `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| Texto principal | `#1D1D1F` |
| Texto secundário | `#6E6E73`, verificar contraste no fundo usado |
| Fundo | `#FFFFFF`; alternado `#F5F5F7`; escuro `#000000` |
| Link / ação | `#0066CC`; foco visível com contraste |
| Conteúdo amplo | max-width 1200px; margens 24px mobile e 48px desktop |
| Coluna editorial | max-width 720px; imagens respeitam a coluna |
| Header | 48px desktop; 56px mobile; sticky sem cobrir foco |
| H1 campanha | clamp(36px, 5vw, 64px); line-height 1.05–1.15 |
| H1 artigo | clamp(28px, 3vw, 40px); line-height 1.15 |
| Corpo editorial | 18px; line-height 1.6; mobile mínimo 16px |
| Espaçamento | escala 4, 8, 12, 16, 24, 32, 48, 64, 96 |
| Cards showroom | raio 24px; borda/sombra discretas |
| Hero institucional | bordas retas; imagem dominante; altura mínima adaptável |
| Botões | raio pill; área interativa mínima 44 × 44px |
| Breakpoints | mobile <768; tablet 768–1023; desktop ≥1024 |

No desktop, mosaico promocional com duas colunas e catálogo com três ou quatro. No celular, uma coluna para campanhas; uma ou duas para recursos conforme legibilidade; cartões promocionais largos voltam a uma coluna. Não comprimir a faixa de navegação desktop até ficar ilegível: migrar para o cabeçalho mobile.

O menu deve abrir por botão, prender foco, fechar com Escape, restaurar foco e bloquear a rolagem do fundo. Fornecer skip link. Usar links para navegação e botões para ações. Respeitar `prefers-reduced-motion`, evitar parallax e autoplay nesta versão. Sem informação essencial acessível apenas por hover.

## 9. Placeholders locais

Os SVGs em `public/placeholders/` são imagens neutras de wireframe, prontas para substituir. Não são capturas do EXECUTAR nem ilustrações científicas. O rótulo do slot é intencional e deve desaparecer quando o ativo final for inserido.

| Arquivo | Dimensão | Uso |
|---|---|---|
| hero-wide.svg | 1920 × 1080 | Campanha institucional |
| feature-landscape.svg | 1200 × 900 | Blocos split e cards largos |
| article-cover.svg | 1600 × 900 | Capa e mídia editorial |
| resource-square.svg | 1000 × 1000 | Recurso/app/produto, object-fit contain |
| category-icon.svg | 240 × 240 | Categorias |
| portrait.svg | 600 × 800 | Autor, parceiros e casos |

Cada asset deve ter width, height, alt, objectFit e focalPoint quando necessário. Usar `alt=""` para decoração; alt contextual para mídia informativa. Não usar serviços aleatórios de imagens remotas. Fotografias e símbolos Apple das capturas ficam exclusivamente no material de referência; usar a marca EXECUTAR e os placeholders na interface construída.

## 10. Organização proposta do código

Preservar o framework e as convenções do repositório existente. Se o ambiente for Next.js App Router, usar o padrão abaixo. A inspeção das referências não exige troca de stack.

```text
app/(public)/…/page.tsx        páginas públicas previstas no CSV
app/(account)/minha-conta/…   área autenticada
app/(admin)/admin/…           área administrativa
components/shell/            header, painel de ecossistema, footer
components/blocks/           componentes registrados
components/ui/               botões, tabs, dialog, campos
lib/navigation/              configuração única dos menus
lib/content/                 adaptador de CMS e dados de demonstração
lib/routes/                  manifesto e validação
lib/blocks/                  schemas e registry
public/placeholders/         assets fornecidos neste pacote
```

Os grupos entre parênteses organizam arquivos e não fazem parte do URL. Cada página resolve seus dados, seleciona a receita e passa blocos ao renderer. Conteúdo pode vir de mocks no protótipo e depois do CMS pelo mesmo contrato. Evitar copiar um componente de página inteiro para cada rota.

Implementar busca, tabs, filtros e carrosséis com estado real no protótipo. Separar ações simuladas das ações integradas: formulário demonstra validação e estado de envio; só declara envio real quando houver endpoint configurado. Acessar App e comprar dependem de destino real. Se ausente, apresentar ação desabilitada com explicação curta, nunca `href="#"` que simula integração pronta.

No ambiente de produção, autenticação e permissões devem ser verificadas no servidor. Esconder links não protege `/admin`. Segredos e webhooks ficam no servidor. A compatibilidade de deploy Cloudflare deve ser verificada no projeto real; este ADR não certifica um build nem uma migração.

## 11. Modelo editorial e CMS

Entidades: Page, Article, Map, App, Resource, Product, ProjectCase, DiscussionTopic e Taxonomy. Campos compartilhados: id, slug, title, description, status, createdAt, updatedAt, seo, media e blocks. Artigos incluem authors, publishedAt, format e references. Produtos incluem preço/moeda somente quando informados. Maps incluem nodes, edges e legend.

Publicação distingue draft e published. Apenas published participa do catálogo, sitemap e busca pública. Preview deve ser identificado e protegido. Não gerar evidência clínica a partir de um texto demonstrativo; usar fontes reais quando o conteúdo final existir.

## 12. Alternativas consideradas e consequências

**Uma página feita manualmente por rota:** simples no começo, mas replica menus e estilos; rejeitada pela manutenção de dezenas de entradas.

**Um template universal:** reduz código, mas prejudica leitura editorial e descoberta de catálogo; rejeitado por perder as três referências.

**Editor totalmente livre:** flexível, mas permite quebrar hierarquia, acessibilidade e consistência; adiado. Templates e registro validado delimitam a composição.

**Decisão adotada:** poucas receitas, blocos tipados e dados separados. O custo inicial é definir contratos e variantes. O benefício é corrigir um bloco e propagar a melhoria a todas as páginas, mantendo a identidade visual.

## 13. Ordem de execução para Claude Design

1. Ler este ADR, os três PNGs e o manifesto de rotas.
2. Criar tokens, shell e menus navegáveis, com marca EXECUTAR.
3. Montar `/`, `/blog/[slug]` e `/ferramentas` como páginas de referência interna.
4. Comparar estrutura e proporções com as três capturas, usando placeholders locais.
5. Derivar Blog, Apps, Loja e institucional pelas receitas compartilhadas.
6. Implementar riscos, mapas, comunidade, formulários e áreas restritas com templates adequados.
7. Conectar todas as entradas do CSV e validar query strings, âncoras e slugs.
8. Entregar protótipo navegável, catálogo de blocos e relatório curto de integrações pendentes.

## 14. Critérios de aceite

- As 78 entradas estão mapeadas; filtro e âncora não geram páginas duplicadas.
- Os seis destinos principais mantêm ordem e rótulos; hambúrguer contém o ecossistema completo.
- Home, artigo e showroom são visualmente distintos e compartilham shell e tokens.
- Conteúdo demonstrativo usa português e marca EXECUTAR, com placeholders locais sem URLs quebrados.
- Cada template dinâmico tem exemplo navegável; slug desconhecido retorna 404.
- `#referencias`, `#comentarios`, `#funcionalidades`, `#como-funciona`, `#acesse` e `#redes-sociais` funcionam quando aplicáveis.
- Busca, filtros, tabs, carrossel, menu e voltar/avançar funcionam; estados vazio, erro e loading existem.
- Layouts revisados em 390px, 768px, 1024px e 1440px; sem overflow horizontal de página.
- Navegação por teclado completa, foco visível, landmarks e hierarquia de headings coerentes.
- Páginas restritas têm proteção real quando integradas; mocks e conexões pendentes são identificados.
- Capturas do resultado final incluem home, artigo e showroom, desktop e mobile, para comparar com as referências.

## 15. Precedência

Instruções posteriores do usuário > este ADR para decisões visuais > CSV para identidade e URLs > blueprints para composição > capturas para referência visual. Em conflito de URL, manter o CSV e registrar a divergência. Não transformar o diretório de rotas da Apple no sitemap do EXECUTAR.
