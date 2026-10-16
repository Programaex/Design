# apps/executar-mobile — Prisma nativo (Expo SDK 58)

App iOS/Android com Expo Router, as mesmas telas do protótipo *Prisma Mobile* e o mesmo domínio do web ([`@executar/core`](../../packages/executar-core)).

| Rota | Tela |
|---|---|
| `login`, `entrar?token=…` | E-mail (link mágico; deep link `executar://entrar`), uso sem conta |
| `wizard` | Questionário de 8 passos |
| `(tabs)/index`, `executar`, `mapa`, `rotinas`, `conta` | Prisma, Executar (Scroll Task com gesto vertical e háptico), Mapa mental, Rotinas, Conta |
| `sync`, `dados`, `ajustes`, `exportar` | Sincronização (fila e conflitos), exportar/importar JSON e CSV, ajustes, modelos A4 (pré-visualização, Imprimir, PDF A4 e HTML pelo menu de compartilhar) |

- **Offline primeiro:** o plano fica no aparelho (AsyncStorage); cada mudança entra na fila e é enviada a `POST /api/sync` do `apps/executar-web`.
- **Sessão:** token assinado no Keychain/Keystore (`expo-secure-store`), enviado como `Authorization: Bearer`.
- **Lembretes:** notificações locais diárias para cada rotina e um alerta de atraso no horário escolhido (`expo-notifications`), sem servidor de push.

## Rodar

```bash
npm ci                                                              # na raiz do monorepo
EXPO_PUBLIC_API_URL=http://<ip-do-computador>:3000 npm start -w apps/executar-mobile
```

O app usa módulos nativos fora do Expo Go padrão (`expo-print`, `react-native-webview`, `expo-secure-store` estão no Expo Go; confira com `npx expo-doctor`). Para build: `npx eas-cli@latest build`.

## Verificação

```bash
npm run typecheck -w apps/executar-mobile
npm run build -w apps/executar-mobile     # expo export: bundles iOS e Android
```

A raiz do monorepo tem React 19.2 (apps web); o `metro.config.js` fixa `react`/`react-native` na cópia deste app (React 19.3, RN 0.88).
