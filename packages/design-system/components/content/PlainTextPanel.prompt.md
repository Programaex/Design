Painel de texto puro com cabeçalho (tipo · título · ID). Preserva quebras de linha; use para exemplos antes/depois, roteiros numerados, limites e listas de fontes.

```jsx
<PlainTextPanel id="EX-A01-001" kind="example" title="Antes e depois">{`ANTES\nLorem ipsum.\n\nDEPOIS\nDolor sit amet.`}</PlainTextPanel>
```

- `kind`: example | procedure | evidence | status | instruction | note. O tipo vira o rótulo do cabeçalho.
- Não coloque HTML dentro: o conteúdo é texto.
