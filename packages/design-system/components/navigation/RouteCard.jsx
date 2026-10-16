import React from 'react';
export function RouteCard({ group, title, path, url, access = 'publico', qr, note, actions, className = '', ...rest }) {
  const tone = access === 'publico' ? 'neutral' : access === 'administrador' ? 'danger' : 'warning';
  const label = access === 'publico' ? 'Pública' : access === 'administrador' ? 'Admin' : 'Autenticada';
  return (
    <article className={['route-card', className].filter(Boolean).join(' ')} {...rest}>
      <div className="route-qr">{qr}</div>
      <div className="route-body">
        {group && <span className="route-group">{group}</span>}
        <div className="route-title">{title}</div>
        <code className="route-path">{path}</code>
        {url && <a className="route-url" href={url} target="_blank" rel="noreferrer">{url}</a>}
        {note && <p className="route-note">{note}</p>}
        <div className="route-actions"><span className={'tag tag-' + tone}>{label}</span>{actions}</div>
      </div>
    </article>
  );
}
