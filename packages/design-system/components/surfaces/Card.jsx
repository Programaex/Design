import React from 'react';
export function Card({ kicker, title, body, meta, elevation, interactive = false, as = 'div', className = '', children, ...rest }) {
  const El = as;
  const cls = ['card', elevation && 'elev-' + elevation, interactive && 'card-interactive', className].filter(Boolean).join(' ');
  return (
    <El className={cls} {...rest}>
      {kicker && <div className="card-kicker">{kicker}</div>}
      {title && <div className="card-title">{title}</div>}
      {body && <p className="card-body">{body}</p>}
      {children}
      {meta && <div className="card-meta">{meta}</div>}
    </El>
  );
}
