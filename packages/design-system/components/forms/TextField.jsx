import React from 'react';
export function TextField({ label, id, multiline = false, className = '', ...rest }) {
  const fid = id || (label ? 'f-' + String(label).toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);
  const El = multiline ? 'textarea' : 'input';
  return (
    <div className={['field', className].filter(Boolean).join(' ')}>
      {label && <label htmlFor={fid}>{label}</label>}
      <El className="input" id={fid} {...rest} />
    </div>
  );
}
