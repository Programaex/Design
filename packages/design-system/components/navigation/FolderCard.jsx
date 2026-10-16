import React from 'react';
export function FolderCard({ id, title, slug, count, status = 'existing', interactive = true, className = '', ...rest }) {
  return (
    <article className={['folder-card', interactive && 'card-interactive', className].filter(Boolean).join(' ')} {...rest}>
      <div className="folder-top"><span className="folder-id">{id}</span><span className="folder-status"><i className={'folder-dot is-' + status} />{count != null ? `${count} ${count === 1 ? 'arquivo' : 'arquivos'}` : status}</span></div>
      <div className="folder-title">{title}</div>
      {slug && <code className="folder-slug">{slug}</code>}
    </article>
  );
}
