# Especificação Funcional — Scroll Task

## Estados
- `idle`: unidade exibida, timer parado.
- `running`: timer ativo.
- `expanded`: contexto/notas abertos.
- `completed`: unidade concluída.
- `deferred`: unidade adiada.
- `timer_elapsed`: tempo previsto encerrado, aguardando decisão.

## Estrutura de dados mínima
```json
{
  "project_id": "",
  "cycle_id": "",
  "execution_scope": "action|task|phase|workflow",
  "item_id": "",
  "title": "Executar ação",
  "estimated_minutes": 30,
  "status": "pending|running|done|deferred",
  "position": 1,
  "remaining_count": 5,
  "notes": "",
  "context": "",
  "auto_scroll": false
}
```

## Regras de interação
- Barra superior: sticky.
- Centro: unidade ativa com prioridade visual máxima.
- Scroll normal: deslocamento local sem trocar imediatamente de unidade.
- Troca de unidade: ultrapassar threshold de gesto definido por plataforma.
- Ao expirar timer: exibir CTA `Concluir`, `+ tempo`, `Adiar`, `Próxima`.
- Auto-scroll: só avança após confirmação ou política configurada; nunca conclui sozinho.
- Duplo toque: alterna `compacto ↔ expandido`.
- Expansão mostra contexto, notas e metadados sem abrir nova tela.

## Acessibilidade
- alternativa a gesto por botões Próxima/Anterior;
- suporte a teclado/switch control;
- alvo mínimo de toque conforme plataforma;
- respeitar reduce motion;
- timer não deve depender apenas de cor.

## Fora de escopo v1
- timer adaptativo por IA;
- reordenação manual completa dentro do modo execução;
- conclusão automática baseada apenas em tempo.
