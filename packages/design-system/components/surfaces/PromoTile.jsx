import React from 'react';
export function PromoTile({ kicker, title, body, actions, media, theme, className = '', children, ...rest }) {
  return (
    <div className={['card', 'card-tile', className].filter(Boolean).join(' ')} data-theme={theme} {...rest}>
      {kicker && <div className="card-kicker">{kicker}</div>}
      {title && <div className="card-title">{title}</div>}
      {body && <p className="card-body">{body}</p>}
      {actions && <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', justifyContent: 'center', marginTop: 'var(--space-2)' }}>{actions}</div>}
      {media && <div style={{ marginTop: 'var(--space-6)', width: '100%', display: 'flex', justifyContent: 'center' }}>{media}</div>}
      {children}
    </div>
  );
}
