# Relatório da pesquisa em oito etapas

| Etapa | Executado | Evidência disponível | Lacuna / próxima decisão |
|---|---|---|---|
| 1 — Decompor referências | Parcial | Brief textual e prancha conceitual gerada | Vídeo e capturas originais não foram enviados; análise quadro a quadro não é possível. |
| 2 — Encontrar modelos | Feito no nível público | Z-Anatomy, brainproject, SPL Head & Neck e Anatria; links no cadastro | Seleção final depende da extração / inspeção de binário. |
| 3 — Licenças | Parcial | CC BY-SA 4.0 dos projetos Z-Anatomy/brainproject; licença SPL Part B; termo FIPAT | Revisão de licença por parte de modelo, misturas com HCP/CIT168 e outros. |
| 4 — Inspecionar arquivos | Bloqueado | Tamanhos públicos de brain.glb e manifest; 437 entradas declaradas, 33 exemplos | Zero arquivos GLB baixados; object_name, hash, geometria, pivô, escala pendentes. |
| 5 — Validar anatomia | Parcial | FIPAT/IFAA identificada como autoridade de terminologia; nomes declarados da fonte | Revisão por anatomista de cada nó, traduções e laterality. |
| 6 — Definir implementação | Especificada | Three.js GLTFLoader/DRACO/Raycaster/AnimationMixer e clipping stencil; arquitetura no DOCX | Validar em ambiente real após GLB disponível. |
| 7 — Planejar desempenho | Especificada, sem benchmark | Metas hipotéticas, LOD/stream e métricas da especificação | Medição real desktop/mobile, bytes e traços de desempenho. |
| 8 — Consolidar e conferir | Executado para arquivos de texto | JSON de mesma base do XLSX, schemas e check_package.py | Aprovação final NO-GO: ativos e testes 3D ausentes. |

## Avaliação comparativa

**Z-Anatomy (preferencial para projeto final):** a melhor procedência única para gerar cabeça + crânio + encéfalo, desde que o projeto Blender original inclua os componentes necessários e cada subasset possa ser redistribuído no uso previsto. Não foi inspecionado.

**brainproject (preferencial para piloto cerebral):** metadados neuroanatômicos ricos, GLB público anunciado e IDs documentados; não cobre a apresentação externa de cabeça/crânio. Parte das estruturas possuem proveniências adicionais registradas, exigindo revisão de compatibilidade e nível de confiança anatômica.

**SPL Head & Neck (opção craniofacial):** procedência institucional e foco em crânio/pescoço. A ficha pública não sustenta disponibilidade de todo o encéfalo; seu uso exigiria registro geométrico e leitura completa das condições de licença.

**Anatria (opção de exports):** GLBs divididos por sistema e baseados em Z-Anatomy; ainda não foi comprovado que as matrizes/escala de esqueletos, sistema nervoso e exterior possam ser combinadas sem correção.

**Decisão de publicação:** somente começar P2 (cabeça completa) após prova de integridade, compatibilidade e direitos dos ativos de uma mesma procedência.
