Data table with hairline rows — use for region/function references and assessment results; status cells reuse Tag.

```jsx
<Table columns={[{key:'fn',label:'Função'},{key:'risk',label:'Risco',render:r=><Tag tone={r.tone}>{r.risk}</Tag>}]} rows={rows} />
```
