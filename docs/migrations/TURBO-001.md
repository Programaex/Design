# TURBO-001 — Extração do workflow

Origem: hubexecutar-lgtm/react-router-starter-template
Commit: 176c2947baa3d9c12123d33ee726725d5c315207

## Alterações

- Workspace independente com apps/workflow e diretório packages reservado.
- Turborepo 2.11.8 fixado, npm workspaces e lockfile único.
- Tarefas build, dev, lint, typecheck e test coordenadas pelo Turbo.
- Cache de build inclui bundles e metadados de deploy do plugin Cloudflare; geração de IA depende dos arquivos da raiz.
- Sem migração do blog, design system do blog ou assets compartilhados de design tokens.
- CSS e componentes internos do workflow preservados.
- Agentes e plugins de suporte copiados da origem; referências aos tokens excluídos precisam de material do destino para executar essas entregas visuais.

## Validação

Instalação npm: passou.
Build TypeScript + Vite (cliente e Worker): passou.
Lint: passou.
Typecheck: passou.
Vitest: 8 arquivos, 64 testes aprovados.
O runtime de teste emitiu avisos sobre CIMD desabilitado e encerramento de instância; não impediram a aprovação dos testes.

## Limite de entrega

Extração local sem histórico Git. Fork remoto não criado: plugin sem operação de fork e conexão Programaex com leitura na origem. Nenhum push ou deploy realizado. Revise os identificadores Cloudflare e o destino do blog antes de publicar.

Autoteste de bootstrap: todos os cenários passaram, usando Wrangler simulado.
Paridade: todos os arquivos originais do app permanecem idênticos, exceto package.json (novo script typecheck).
