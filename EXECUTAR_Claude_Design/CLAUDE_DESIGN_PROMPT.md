# Prompt de execução — Claude Design

Construa um protótipo navegável do EXECUTAR seguindo `ADR-001-arquitetura-blocos.md`. Use o CSV de 78 entradas como contrato de rotas e `route-blueprints.json` como contrato de composição. Inspecione os três PNGs completos em `referencias/` antes de desenhar.

Reproduza com alta fidelidade a organização visual das referências: Apple Brasil para institucional; o artigo Apple Developer para editorial; Apple Acessórios para showroom. A identidade e o conteúdo são EXECUTAR. Use somente os placeholders locais fornecidos nesta etapa.

Mantenha o menu principal: logo EXECUTAR para `/`, Blog, Riscos cognitivos, Mapa cognitivo, Apps e Ferramentas. Acrescente busca, conta e hambúrguer com todo o ecossistema. Mobile: logo, busca e hambúrguer, com conta dentro do painel.

Construa primeiro o shell, depois três páginas completas: home, um artigo e Ferramentas. Crie os demais destinos reutilizando blocos e receitas. Não entregue uma única landing page com todos os links apontando para seções. Páginas, filtros e âncoras têm comportamentos diferentes definidos no CSV.

Implemente composição por registry tipado: cada bloco tem id, type, version e props. Siga `blocks.registry.json`. Use `page-examples.json` como dados iniciais de demonstração, não como conteúdo científico final. As sequências em `route-blueprints.json` são receitas; podem repetir blocos de texto/mídia conforme o conteúdo.

Preserve o framework existente. Se trabalhar em ambiente de protótipo sem servidor, simule os dados explicitamente e registre autenticação, CMS, formulários e checkout como pendências. Não declare proteção de backend ou envio real se só houver UI. Não invente destinos de aplicativos, preços, depoimentos ou referências científicas.

Verifique desktop e mobile, rotas dinâmicas, âncoras, filtros e histórico do navegador. Mostre um relatório final com páginas implementadas, blocos reutilizados, testes realizados e integrações pendentes. Entregue também capturas completas do resultado em home, artigo e showroom.
