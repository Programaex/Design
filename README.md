# Design

Repositório do design system **Nocturne — Apple edition (Noturno)**.

## Estrutura

```
DESIGN_SYSTEM-NOTURNO/
├── readme.md        # guia completo do design system
├── styles.css       # stylesheet único com todos os tokens
├── theme.json       # tokens de origem do tema
├── theme.html       # visão geral do tema
├── thumbnail.html
├── foundations/     # cor, tipografia, ícones, imagem, layout
├── components/      # botões, cards, formulários, navegação, tabela, diálogo
├── templates/       # landing e deck (pontos de partida)
└── assets/
```

## Como usar

Linke o stylesheet em cada página e use as variáveis CSS (`var(--color-*)`, `var(--font-*)`, `var(--space-*)` …):

```html
<link rel="stylesheet" href="DESIGN_SYSTEM-NOTURNO/styles.css">
```

O tema escuro é o padrão; o claro é ativado com `data-theme="light"`. Veja o guia completo em [`DESIGN_SYSTEM-NOTURNO/readme.md`](DESIGN_SYSTEM-NOTURNO/readme.md).

## CMS EXECUTAR

`apps/site` publica o CMS e o site real no Worker `design` (https://design.bus-programa.workers.dev). Veja [`apps/site/README.md`](apps/site/README.md).

## NEUROATLAS

`apps/neuroatlas` é o root do app de atlas 3D do encéfalo (rota `/neuroatlas/`): documentação, dados, schemas e modelos para o Claude Design. Comece por [`apps/neuroatlas/README.md`](apps/neuroatlas/README.md).
