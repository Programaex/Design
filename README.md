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

## Apps EXECUTAR · Prisma

| Pasta | O que é |
|---|---|
| [`apps/executar-web`](apps/executar-web) | Landing do produto, app Prisma (PWA), modelos A4 e API Next.js + Prisma ORM |
| [`apps/executar-mobile`](apps/executar-mobile) | App nativo iOS/Android (Expo SDK 58) |
| [`packages/executar-core`](packages/executar-core) | Domínio compartilhado: plano, execução, modelos A4, sync |
