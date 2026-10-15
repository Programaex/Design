# Instruções de desenvolvimento — Scroll Task

## 1. Objetivo

Implementar um modo de execução de baixa carga visual no qual **um único item executável ocupa a região central**, mantendo topo e base intencionalmente vazios. A interface deve favorecer continuidade de execução e reduzir navegação, configuração e troca de contexto.

## 2. Contrato visual

- Barra superior fixa: projeto + progresso + pendências + menu de granularidade.
- Corpo dividido conceitualmente em 33% / 33% / 33%.
- Região central: um item por vez.
- Título executável: preferencialmente 2–4 palavras, linguagem de ação.
- Contexto e notas ficam recolhidos por padrão.
- Não transformar a tela em lista tradicional.

## 3. Granularidade

Enum recomendado:

`action | task | phase | workflow`

A troca de granularidade deve reconstruir a sequência atual sem alterar o projeto ativo.

## 4. Estados mínimos

`READY -> RUNNING -> PAUSED | TIME_UP -> READY`

Estados auxiliares:

- `AUTO_SCROLL`
- `CONTEXT_OPEN`
- `COMPLETED`

O timer **não pode concluir o item automaticamente**.

## 5. Regras de navegação

- swipe vertical com limiar mínimo para evitar mudança acidental;
- oferecer sempre alternativa por botão/teclado;
- debounce de wheel/gesto;
- Auto-scroll avança somente a visualização;
- conclusão exige ação explícita do usuário.

## 6. Timer

Preset V1: 15, 30 e 45 min.

Campos:

- `estimateMinutes`
- `remainingSeconds`
- `timerState`
- `autoScrollEnabled`

Ao chegar a zero:

1. emitir feedback visual/acessível;
2. se Auto-scroll = off: parar em `TIME_UP`;
3. se Auto-scroll = on: avançar um item e reiniciar a estimativa;
4. nunca alterar `status` para `done` automaticamente.

## 7. Modelo de item

```json
{
  "id": "ACT-001",
  "type": "action",
  "title": "Abrir documento",
  "context": "Descrição opcional",
  "estimateMinutes": 30,
  "status": "ready",
  "notes": ""
}
```

Status recomendados:

`ready | in_progress | done | deferred | blocked`

## 8. Persistência

Persistir no backend:

- projeto e ciclo ativos;
- granularidade escolhida;
- índice/ID atual;
- notas;
- status do item;
- estimativa selecionada;
- preferência de Auto-scroll.

O timer de sessão pode ser local, mas deve sobreviver a background/reload usando timestamp de início/fim, não `setInterval` como fonte de verdade.

## 9. Arquitetura sugerida

Componentes:

- `ExecutionHeader`
- `GranularityMenu`
- `ExecutionViewport`
- `ExecutionItem`
- `ContextDrawer`
- `ExecutionTimer`
- `ExecutionControls`

Serviços/hooks:

- `useExecutionQueue()`
- `useExecutionTimer()`
- `useGestureNavigation()`
- `useExecutionPersistence()`

## 10. Acessibilidade

- alvo táctil >= 44 px;
- contraste WCAG AA;
- `aria-live` para término do timer;
- navegação integral por teclado;
- alternativa a swipe e duplo toque;
- respeitar `prefers-reduced-motion`;
- notas e contexto nunca dependerem somente de gesto oculto.

## 11. Analytics mínimos

Eventos:

- `execution_mode_opened`
- `granularity_changed`
- `timer_started`
- `timer_paused`
- `timer_elapsed`
- `auto_scroll_triggered`
- `item_completed`
- `item_deferred`
- `context_opened`
- `note_added`

Evitar usar tempo de permanência como proxy isolado de produtividade.

## 12. Critérios de aceite V1

- Um único item executável é dominante na tela.
- Troca de item exige gesto deliberado ou controle explícito.
- Timer funciona em 15/30/45 min.
- Auto-scroll é opcional.
- Zero no timer não conclui item.
- Usuário consegue abrir contexto e registrar nota.
- Granularidade pode ser trocada entre ação/tarefa/fase/workflow.
- Estado e notas persistem após reabertura.
- Todos os fluxos principais funcionam sem gesto oculto.

## 13. Validação de produto

Tratar como hipóteses a validar em teste de usabilidade:

- limiar ideal de swipe;
- valor real do Auto-scroll;
- presets ideais de tempo;
- necessidade de feedback tátil/sonoro;
- impacto da mudança automática de item sobre interrupção cognitiva.
