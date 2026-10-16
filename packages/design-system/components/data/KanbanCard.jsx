import React from 'react';
export function KanbanCard({ id, title, context, tone = 'neutral', done = false, className = '', children, ...rest }) {
  return (
    <article className={['kb-card', done && 'is-done', className].filter(Boolean).join(' ')} {...rest}>
      <div className="kb-card-top">{id && <code className="kb-id">{id}</code>}{context && <span className={'tag tag-' + tone}>{context}</span>}</div>
      <div className="kb-card-title">{title}</div>
      {children}
    </article>
  );
}
