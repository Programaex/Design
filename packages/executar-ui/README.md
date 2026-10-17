# @executar/ui

Telas e primitivos React do Prisma, extraídos de `apps/executar-web` para serem usados também pelos mini apps (`apps/miniapps`).

- `usePrismaApp({ remote, isolated, onOpenExport })` — estado do app. `remote: true` liga sessão e sync com a API (app web); sem ele o plano fica só no aparelho (mini apps). Os dois gravam o mesmo formato em `localStorage` (`executar-prisma-v1`).
- Telas: `Login`, `Wizard`, `PrismaTab`, `MapaTab`, `ExecutarTab`, `RotinasTab`, `ContaTab`, `SyncScreen`, `DadosScreen`, `AjustesScreen`, `ExportViewer`.
- Estilo: `@executar/ui/theme.css` (tokens do design system + `@theme` do Tailwind 4). O app consumidor importa `tailwindcss`, este CSS e declara `@source` para esta pasta.
