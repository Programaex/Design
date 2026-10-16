# Família vetorial monocromática v1.0.0

ID: BRAND-MONO-001 | VERSION: 1.0.0 | AREA: Design | WORKFLOW: reconstrução vetorial | OWNER: A DEFINIR | STATUS: VERIFIED

INPUT: IMG_3944.jpeg e IMG_3943.jpeg, referências visuais fornecidas. OUTPUT: dois símbolos SVG, dois templates Jinja, sete camadas SVG, tokens, exportador e previews. DEPENDS_ON: Jinja2 para regenerar. BLOCKS: nenhum para utilizar os SVGs prontos. AUTOMATION_LEVEL: A4 para geração e validação local; importação Canva não executada.

## Design

Adaptação monocromática inspirada na estética minimalista da Apple; não é um asset oficial da Apple. Mesma prancheta de 512 × 512, fundo transparente, curvas Bézier suaves, preenchimentos sólidos, sem contornos, filtros, imagens incorporadas ou efeitos de transparência. Geometria redesenhada, não traçado pixel a pixel. Cérebro preserva três massas e abertura central; sobreposições passam a ser opacas para leitura consistente.

Paleta: preto #000000, branco #FFFFFF, cinza claro #D2D2D7, médio #86868B e escuro #1D1D1F. Tokens raw e aliases semânticos em tokens.json. Os SVGs prontos têm cores resolvidas para interoperabilidade.

## Canva

Faça upload dos arquivos de svg/ para usar os símbolos completos. Para mover/redimensionar cada forma de maneira independente, faça upload das peças de layers/ e sobreponha todas na mesma posição, com o mesmo tamanho 512 × 512. Ordem: back → middle → front → check; left → right → lower. Agrupe ao terminar. A área transparente de cada camada mantém o alinhamento. Não foi verificado no Canva se os controles de recoloração estarão disponíveis.

## Jinja

Os .svg.jinja são templates de geração, não arquivos importáveis diretamente no Canva. Instale Jinja2 e execute `python export.py`; importe os SVGs resultantes. Altere tokens.json para recolorir mantendo a geometria. Previews são apenas conferência visual e não substituem o vetor.

## Origem e créditos

A segunda referência exibe vastardstudio.com e © All Rights Reserved. Esse crédito é preservado neste registro e nos metadados do SVG. Direitos/licença de uso comercial: A DEFINIR; esta entrega não concede direitos sobre a referência. Arquivos enviados não foram alterados.

## Evidências e aceite

XML dos dois SVGs e das sete camadas validado; templates renderizados com StrictUndefined; ausência de bitmaps; renderização PNG para inspeção visual. Reconstrução estilizada e padronização concluídas. HANDOFF: importar SVGs no Canva; utilizar camadas quando for necessária edição por forma.
