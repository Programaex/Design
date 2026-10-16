# EXECUTAR NEUROATLAS — comando operacional para Claude Design

Leia primeiro `README.md`, `VALIDACAO_TECNICA.md`, ambos os DOCX, as 9 abas operacionais de `NEUROATLAS_DADOS.xlsx`, `FONTES_E_LICENCAS.md`, `data/MASTER_SOURCE.json` e todos os `data/*.json`. Use `NEUROATLAS_REFERENCIA_VISUAL.png` **apenas como referência conceitual de UI**, nunca para inferir objetos anatômicos.

## Contrato de execução e primeira resposta
1. Inventarie anexos acessíveis, caminhos e hashes. Indique explicitamente: **nenhum GLB anatômico acompanha este ZIP de pesquisa**. Se nenhum modelo adicional for fornecido, implemente somente um shell de interface responsivo, estados de carregamento, fonte/licença e dados desabilitados; **não invente cabeça/encéfalo 3D**.
2. Se o arquivo `assets/models/brain.glb` for adicionado, inspecione árvore real, extras, material, bytes e limites; confirme as 33 associações `NEU-XXXX` usando `external_id`/`node_manifest_name`. Atualize `object_name` e `verified_object`; não assumir que nomes sobrevivem à otimização.
3. Se Z-Anatomy original for entregue, extraia cabeça, crânio e cérebro com matrizes compartilhadas, somente após auditoria das licenças por subasset. Documente ausências.
4. Resolva conflitos MASTER/XLSX/JSON/GLB, gere relatório de diffs e interrompa somente o módulo afetado.

## Visão editorial
Identidade EXECUTAR; fundo #1455CC com variações sutis; acentos #86B9F2, #FFD52A, #F04D36, #F3F0E8, #B9C0C8. Desktop com coluna editorial à esquerda (25%), canvas central dominante (~50%) e painel de controles à direita (~25%), sem ocultar modelos. Poster 16:10 de modelo suspenso, iluminação difusa e sombra discreta. Não copiar posições em pixels da prancha: testar responsividade real em 1440/1024/390 px.

## Stack e módulos
Recomendar React + TypeScript + Three.js + React Three Fiber/Drei, JSON Schema, Vite (se ambiente suportar). Estruturar `AssetLoader`, `StructureRegistry`, `LayerStore`, `SelectionController`, `CameraRig`, `ExplodeController`, `LabelOverlay`, `Timeline`, `ResponsivePreview` e `ValidationPanel`. Não introduzir backend obrigatório para exploração local.

## Regras das interações
- Habilitar seleção/picking apenas para estruturas verificadas, identificadas por ID de objeto real. Usar raycast e resolver ID via extras/manifesto.
- Camadas: distinguir grupos didáticos de sistemas de anatomia; controles de crânio e superfície devem iniciar desabilitados em `MDL-002`.
- Corte anatômico: não usar mera transparência ou clipping aberto como substituto de secção fechada; exigir cap anatômico ou asset preparado.
- Explodido: cada estrutura deve manter referência ao transform original. `manual explode` pausa autoplay; reversão conserva transform inicial.
- Legendas HTML, foco/teclado, oclusão, anticolisão, modo texto, aria-live para status. Respeitar `prefers-reduced-motion`.
- Painel compacto, recolhível e legível; prévia desktop/tablet/mobile muda largura real da área de canvas.
- Modo indisponível: desabilitar e mostrar motivo extraído dos dados, não simular.

## Timeline de 8 segundos (somente com offsets reais)
Para tempo absoluto t, segmentos: 0–2 separado; 2–4 transição para montado; 4–5 mantido; 5–7 retorno separado; 7–8 estabilização. Função pura `poseAt(t, baseTransforms, validatedOffsets)`; buscar t repetidamente deve gerar mesma matriz por objeto. Não usar acumulação incremental por frame. Somente ativar `ANIM-8S` se `exploded_offsets` não null e tiver validador aprovado.

## UI de estados
`loading`, `ready-partial`, `ready-complete`, `asset-error`, `webgl-unsupported`, `reduced-motion`, `missing-license`; visualização estática de poster em falha, com aviso de ilustração conceitual. Enquadramento sem clipping em qualquer proporção. Câmeras reais dependem de bounds, nunca completar campos null com números ilustrativos no catálogo.

## Critérios de aceite / entrega
1. Gerar app fonte, scripts de build, README de instalação e screenshot de cada breakpoint.
2. Registrar matriz de requisitos por status implementado/testado/bloqueado.
3. Inspecionar licenças e disponibilizar créditos, atribuições e alterações de modelo no rodapé.
4. Medir latência de carga, bytes e fps no dispositivo + navegador registrados. Metas propostas 60fps desktop/30fps mobile, não fatos atingidos.
5. Só renderizar/exportar vídeo de 8s após a animação funcionar e a ferramenta de exportação estar realmente disponível; documentar resolução/codificação e nomes produzidos.
6. Não alegar validação anatômica a partir de modelo visual gerado por IA; solicitar revisão humana especializada.

## Ordem de saída quando modelo faltar
Entregar a interface, o painel real com controles bloqueados, catálogo de fonte/pendências, validador e fluxo de importação. Não marcar o projeto completo. Pendências obrigatórias: arquivo GLB, hash, objetos e extras, license by asset, lateralidade/escala, posições, offsets, cap, revisão FIPAT.
