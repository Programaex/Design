# ADR-001 — Scroll Task / Execução Sequencial

## Status
Proposto para implementação e validação UX.

## Contexto
O Executor App precisa permitir execução com baixa carga cognitiva, reduzindo troca de contexto e mantendo somente a próxima unidade de trabalho em foco.

## Decisão
Adotar uma tela de execução vertical com foco central e navegação por scroll controlado.

### Princípios
- Tela dividida conceitualmente em 33% topo / 33% centro / 33% base.
- Topo e base permanecem visualmente leves/quase vazios.
- A unidade ativa ocupa o centro.
- Scroll curto move a viewport; mudança de unidade exige gesto deliberado/mais forte para evitar trocas acidentais.
- Barra superior fixa mostra projeto/ciclo atual e contadores de pendências.
- Escopo de execução selecionável: ação, tarefa, fase ou workflow.
- Timer estimado selecionável por presets (15/30/45 min) e extensível.
- Auto-scroll opcional avança ao fim do tempo configurado.
- Duplo toque expande a unidade ativa para contexto/notas sem sair da execução.

## Consequências
### Positivas
- Menor densidade informacional.
- Próxima ação explícita.
- Continuidade visual entre unidades.
- Permite execução granular ou agregada.

### Riscos
- Auto-scroll pode interromper tarefas incompletas.
- Gesto “forte” precisa de calibração/acessibilidade.
- Duplo toque pode conflitar com convenções de plataforma.

## Mitigações
- Auto-scroll desligado por padrão ou configurável.
- Confirmação/estado “adiar” quando timer expirar.
- Alternativa por botões/teclado para acessibilidade.
