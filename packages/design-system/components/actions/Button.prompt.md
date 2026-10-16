Pill-shaped action button — use `primary` for the single call to action per view, `secondary`/`ghost` beneath it.

```jsx
<Button variant="primary">Começar avaliação</Button>
<Button variant="ghost" iconAfter={<i className="ph ph-caret-right" />}>Saiba mais</Button>
<Button variant="secondary" size="sm">Entrar</Button>
```

- `variant`: primary | secondary | ghost · `size`: md | sm · `iconOnly` (40px round, needs aria-label) · `block` · `href` renders a link.
- Hover darkens one accent step, press two; disabled = 45% opacity.
