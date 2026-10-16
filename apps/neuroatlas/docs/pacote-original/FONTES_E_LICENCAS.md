# FONTES E LICENÇAS — NEUROATLAS
Consulta: 2026-10-16. Esta lista registra evidência pública, **não atesta auditoria de todos os binários**.

| ID | Fonte / arquivo | URL | Licença declarada | Limite de verificação |
|---|---|---|---|---|
| MDL-001 | Z-Anatomy — atlas-fonte | https://github.com/Z-Anatomy/Models-of-human-anatomy | CC BY-SA 4.0 no repositório; ativos de terceiros listados | ZIP/.blend não obtido. Separar inclusões NC de partes redistribuíveis. |
| MDL-002 | brainproject — brain.glb | https://raw.githubusercontent.com/itayinbarr/brainproject/main/brain-atlas/models/brain.glb | CC BY-SA 4.0 atribuída aos ativos; software Apache 2.0 | Metadados GitHub: 4.650.816 bytes; download **não** verificado; procedência diferenciada em 437 entradas. |
| DATA-002 | Manifest 437 registros | https://raw.githubusercontent.com/itayinbarr/brainproject/main/brain-atlas/models/manifest.json | Metadados derivados, descritos pelo projeto como CC BY-SA 4.0 | 33 registros de amostra exportados; IDs internos e nomes vêm do manifesto, não da inspeção do GLB. |
| MDL-003 | SPL Head & Neck Atlas | https://www.openanatomy.org/atlas-pages/atlas-spl-head-and-neck.html | 3D Slicer License, seção B | Escopo crânio/pescoço; não há confirmação de encéfalo nesta fonte. |
| LIC-003 | Licença Slicer seção B | https://www.openanatomy.org/atlas-pages/slicer-license.html | Atribuição, preservação de termos, aviso de modificações | Terceiros podem exigir licenças distintas. |
| MDL-004 | Anatria-3D (arquivos masculinos) | https://github.com/Nurkan1/Anatria-3D | CC BY-SA 4.0 para modelos masculinos; código BSL 1.1, segundo README | Não copiar o aplicativo sob a licença dos modelos; alinhamento entre GLBs não testado. |
| LAW-01 | Creative Commons CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Compartilhar, adaptar e uso comercial com atribuição e mesma licença dos derivados | Verificar no projeto e em cada subativo. |
| ANAT-01 | FIPAT/IFAA — Terminologia Anatomica / Neuroanatomica | https://ifaa.net/committees/anatomical-terminology-fipat/fipat-ifaa-terminologies/ | Referência de terminologia (não é licença de mesh) | Conferência de cada nome e lateralidade ainda pendente. |
| DEV-01 | Three.js GLTFLoader | https://threejs.org/docs/pages/GLTFLoader.html | Documentação técnica | Base para carregamento e extras. |
| DEV-02 | Three.js DRACOLoader | https://threejs.org/docs/pages/DRACOLoader.html | Documentação técnica | Aplicável ao candidato comprimido. |
| DEV-03 | Three.js Raycaster | https://threejs.org/docs/pages/Raycaster.html | Documentação técnica | Base para seleção. |
| DEV-04 | Three.js AnimationMixer | https://threejs.org/docs/pages/AnimationMixer.html | Documentação técnica | setTime permite busca temporal; não substitui offsets definidos. |
| DEV-05 | Three.js clipping stencil | https://threejs.org/examples/webgl_clipping_stencil.html | Demonstração técnica | Fechamento real requer validação de geometria de corte. |
| DEV-06 | glTF Transform | https://gltf-transform.dev/cli | CLI documentada | Inspecionar e otimizar, preservando nomes/extras. |
| DEV-07 | React Three Fiber — performance | https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx | Documentação técnica | Guidelines, não medições deste produto. |
| DEV-08 | Cloudflare Pages + React | https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/ | Guia oficial de deploy | Opção para frontend estático, não prova deploy do NEUROATLAS. |

## Condições de uso e risco

1. O `brain.glb` inclui no manifesto múltiplas proveniências (Z-Anatomy/BodyParts3D, HCP1065, Neudorfer, Najdenovska, CIT168 e possivelmente outras). **Não tratar todo o conteúdo como se viesse de uma única fonte**. Revisar avisos, derivações e condições aplicáveis antes de publicação comercial.
2. A licença CC BY-SA 4.0 permite finalidade comercial com créditos, link, indicação de mudanças e compartilhamento de adaptações sob a mesma licença. Não significa licença exclusiva, nem libera marca/privacidade ou materiais adicionais sob outras licenças.
3. O repositório Z-Anatomy documenta algumas inclusões não comerciais (p. ex. partes de ouvido interno/órgãos). Uma conversão seletiva deve EXCLUIR conteúdo de licença incompatível com o uso previsto.
4. A imagem `NEUROATLAS_REFERENCIA_VISUAL.png` é **gerada como referência visual conceitual**; sua anatomia visual não foi validada, nem corresponde necessariamente ao GLB.
5. Status editorial: fontes públicas consultadas em 2026-10-16; **nenhum arquivo-fonte de malha 3D foi baixado para este pacote**.
