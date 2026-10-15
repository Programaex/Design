# PRD — Scroll Task

## Objetivo
Permitir execução sequencial de trabalho com uma unidade por vez, mantendo contexto mínimo e reduzindo navegação e recapitulação.

## Usuário-alvo
Usuários que executam projetos/multiprojetos e se beneficiam de menor densidade visual, próxima ação explícita e redução de troca de contexto.

## Jobs to be Done
- “Quero saber exatamente o que fazer agora.”
- “Quero executar sem reorganizar minhas tarefas.”
- “Quero alternar entre ação, tarefa, fase e workflow sem reconstruir o plano.”

## Requisitos funcionais
1. Exibir projeto/ciclo atual em barra fixa.
2. Exibir contador de pendências do escopo atual.
3. Permitir escopo: ação, tarefa, fase, workflow.
4. Mostrar uma unidade ativa por viewport.
5. Permitir timer previsto com presets 15/30/45 min.
6. Permitir auto-scroll configurável.
7. Permitir mudança manual por gesto deliberado.
8. Duplo toque expande contexto, notas e metadados.
9. Manter posição visual estável entre unidades.
10. Registrar conclusão, adiamento e interrupção.

## Critérios de aceite
- Usuário inicia execução em ≤2 interações a partir da visão do projeto.
- Próxima unidade fica inequívoca.
- Mudança involuntária por scroll comum é minimizada.
- Auto-scroll nunca marca conclusão automaticamente.
- Expansão de contexto não remove o usuário do modo execução.

## Métricas
- tempo até iniciar primeira ação;
- taxa de conclusão por sessão;
- trocas manuais de contexto;
- abandonos durante execução;
- uso de auto-scroll;
- expansões de contexto por unidade.
