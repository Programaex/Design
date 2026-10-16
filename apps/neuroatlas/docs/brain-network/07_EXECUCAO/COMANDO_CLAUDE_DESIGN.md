# EXECUTAR BRAIN NETWORK — COMANDO CLAUDE DESIGN (v1)

## PAPEL E OBJETIVO
Você é designer de produto e engenheiro frontend 3D. Construa um protótipo web FUNCIONAL e RESPONSIVO do EXECUTAR Brain Network conforme os anexos. O produto representa relações entre pessoas, equipes e responsabilidades em um grafo; o cérebro translúcido é uma metáfora editorial, não uma anatomia que explicaria essas relações.

## ENTRADAS (LER ANTES DE IMPLEMENTAR)
- PRD, FRD, UX/UI, Motion/3D, Arquitetura & Dados, QA.
- A planilha `06_OPERACIONAL/BN_RASTREABILIDADE.xlsx`, todas as abas.
- `08_CONTRATOS/*.schema.json` e `08_CONTRATOS/fixtures_demo.json`.
- `09_REFERENCIAS/REFERENCIAS_INDEX.csv` e 10 imagens da pasta. Não copiar marcas ou avatares das capturas.
- `DECISOES_EM_ABERTO.md`.

## EXECUÇÃO POR FASE
1. **Inventário:** confirme quais arquivos e GLBs foram realmente lidos; informe lacunas. Não afirme ter modelo real se não houver.
2. **Shell:** criar layout premium claro (topbar, sidebar, canvas central, floating controls, inspector direito, faixa de filtros e presets).
3. **Dados:** usar exclusivamente fixtures DEMO com marcador visível até conexão real; `id` é a fonte de verdade de pessoas, vínculos e groups.
4. **Renderização:** apresentar cérebro/globo translúcido de aparência sofisticada com anéis e avatares de placeholder. Se não houver GLB verificável, usar geometria/proxy procedural rotulado “conceitual”, sem simular anatomia científica.
5. **Interação:** navegar com mouse/touch/teclado, hover, seleção, highlight, busca, filtros de tipos de relação, inspector, isolamento, camadas, presets de câmera e lista 2D alternativa.
6. **Motion:** implementar MOT-01...MOT-10 e CAM-01...CAM-10 conforme documentação. Drag/scrub cancela autoplay; reduced motion desativa movimento não essencial; seek determinístico.
7. **Responsivo:** 1440, 1024 e 390 px, com largura real. Em mobile usar drawer e inspector bottom-sheet. Não apenas escalar screenshot.
8. **Qualidade:** executar testes P0 e lista de pendências; não marcar recursos incompletos como operantes. Botões sem comportamento devem ficar desabilitados e explicar dependências.

## CONTRATO DE RESULTADO
- App com componentes React reutilizáveis; renderer Three.js / react-three-fiber se disponível, com fallback SVG/lista.
- Uma fonte única de fixtures e tipos de dados; sem duplicar conteúdo em componentes.
- UI acessível com indicadores de foco, rótulos, tratamento de erro, loading, empty e permission-denied.
- README de execução, lista de funcionalidades implementadas/testadas/pendentes.
- Privacidade e licenças evidenciadas; não embutir pessoas reais e nem dados de saúde.

## IDENTIDADE VISUAL
Fundo `#F7F9FC`, superfícies brancas, texto `#17233F`, azul `#1455CC`, coral `#F04D36`, gelo `#EAF2FF`, lilás `#9E85E8`, amarelo de acento `#FFD52A`. Cérebro gelo translúcido, luz diffuse, sombras sutis, muito espaço vazio e hierarquia editorial. O cérebro visual domina, não sacrificar legibilidade.

## PROIBIÇÕES
- Não inventar dados médicos ou conectividade neural.
- Não gerar relações de pessoas com base em proximidade de avatares.
- Não copiar marcas ou fotos das referências.
- Não inventar nome de objeto GLB, escala, câmera absoluta, caminho de arquivo ou licença.
- Não declarar backend, login ou importação reais quando houver apenas mock.
