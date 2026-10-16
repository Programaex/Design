import React from 'react';
export function SegmentedControl({ name, options = [], value, defaultValue, onChange, ariaLabel }) {
  const [inner, setInner] = React.useState(defaultValue ?? (options[0] && options[0].value));
  const cur = value !== undefined ? value : inner;
  return (
    <div className="seg" role="radiogroup" aria-label={ariaLabel}>
      {options.map(o => (
        <label className="seg-opt" key={o.value}>
          <input type="radio" name={name} value={o.value} checked={cur === o.value} onChange={() => { setInner(o.value); onChange && onChange(o.value); }} />
          {o.icon}{o.label}
        </label>
      ))}
    </div>
  );
}
