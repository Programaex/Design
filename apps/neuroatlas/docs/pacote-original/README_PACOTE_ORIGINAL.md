# EXECUTAR — NEUROATLAS / pacote de pesquisa e pré-implementação
**Data:** 2026-10-16  ·  **Estado:** documentação e dados parciais; ainda NÃO apto para construir o conjunto cabeça + crânio + encéfalo.

## Comece aqui
1. Leia `VALIDACAO_TECNICA.md` e `FONTES_E_LICENCAS.md` para conhecer os bloqueios e obrigações.
2. Consulte `NEUROATLAS_PRD.docx` e `NEUROATLAS_ESPECIFICACAO_TECNICA.docx` para produto, arquitetura e aceite.
3. Abra `NEUROATLAS_DADOS.xlsx`: 9 abas operacionais, mais `Fontes` e `Resumo`. Esta planilha é exportada de `data/MASTER_SOURCE.json`.
4. Veja `NEUROATLAS_REFERENCIA_VISUAL.png` como **moodboard conceitual**, nunca como prova anatômica ou quadro do vídeo original (não fornecido).
5. Obtenha os modelos das URLs registradas, preservando licença e nomes. Rode `scripts/inspect_glb.py` (local) e complete os vínculos.
6. Após resolver ativos e revisar anatomia, entregue este pacote ao Claude Design com `NEUROATLAS_COMANDO_CLAUDE_DESIGN.md`.

## O que existe
- `data/MASTER_SOURCE.json`: base canônica de exportação. **Amostra de 33 nós declarados** de um manifesto público de 437, com IDs próprios conservados em `external_id`.
- `data/*.json`: exports consistentes de camadas, materiais, controles, câmeras, animações, rótulos, presets e 33 estruturas amostrais.
- `schemas/*.schema.json`: contrato de tipos com campos geométricos null quando não medidos.
- `research/`: roteiro de auditoria e evidências de metadados.
- `assets/models/`: **sem GLB**; não criar geometria inventada. `assets/posters/` contém ilustração conceitual.
- `scripts/inspect_glb.py`: lê cabeçalho e árvore glTF GLB não comprimida da seção JSON, lista nós, nomes, extras, materiais e textura; escreve relatório; não valida formas anatomicamente.
- `scripts/check_package.py`: valida integridade entre IDs, referências e ausências de coordenadas fictícias.

## Bloqueios do MVP completo
- `MDL-001` Z-Anatomy fonte completa não foi obtido / convertido.
- `MDL-002` brain.glb tem URL, tamanho listado e manifesto público, mas bytes não foram obtidos; seleção real não verificada.
- Crânio/pele não estão incluídos em `MDL-002`. Não alinhar modelos de fontes diferentes por simples convenção.
- `ANIM-8S` tem cronograma, mas offsets e trajetórias vazios; controles relacionados desabilitados.
- Prévia responsiva e interface são especificações, **não app executado**.

## Regras anti-alucinação
Campos `position`, `target`, `object_name`, `anchor`, `exploded_offsets` são `null` até inspeção. O campo `node_manifest_name` registra literalmente o texto da fonte (pode conter espaço inicial); não garante o nome do nó em runtime. Confirmar convenção de eixos, unidades, árvore de meshes e `extras.bx_id`. É proibido promover `PENDENTE` a `VERIFICADO` sem prova.

## Dependências locais sugeridas
Blender 4.x, Python 3.11+, `jsonschema` (opcional), Three.js + React / React Three Fiber; `gltf-transform` opcional. `scripts/inspect_glb.py` usa só Python stdlib e inspeção superficial; Draco exige visualizador/Blender para geometria.

## Atualização de dados
Mantenha `data/MASTER_SOURCE.json` como fonte única. Ao editar, regenere os arquivos JSON com `python scripts/regenerate_json.py` e a planilha em ambiente `artifact_tool`. Execute `python scripts/check_package.py`. Não edite o XLSX e JSON de forma independente.

## Destino Cloudflare (opcional)
A aplicação front-end pode ser publicada em Cloudflare Pages conforme guia oficial; mantenha assets 3D em serviço compatível com cabeçalhos cache/CORS e verifique limitações de upload/transferência antes do lançamento.

## Licença deste pacote
O conteúdo editorial do EXECUTAR é rascunho. **Licenças dos ativos anatômicos de terceiros permanecem independentes** e descritas em FONTES_E_LICENCAS.md. Não redistribuímos modelos binários neste ZIP.
