import React from 'react';
export function RadioGroup({ name, options = [], value, defaultValue, onChange, label }) {
  const [inner, setInner] = React.useState(defaultValue ?? (options[0] && options[0].value));
  const cur = value !== undefined ? value : inner;
  const lid = name + '-label';
  return (
    <div className="field">
      {label && <span className="field-label" id={lid}>{label}</span>}
      <div role="radiogroup" aria-labelledby={label ? lid : undefined} style={{ display: 'grid', gap: 'var(--space-1)' }}>
        {options.map(o => (
          <label className="radio" key={o.value}>
            <input type="radio" name={name} value={o.value} checked={cur === o.value} onChange={() => { setInner(o.value); onChange && onChange(o.value); }} />
            <span className="dot"></span>{o.label}
          </label>
        ))}
      </div>
    </div>
  );
}
