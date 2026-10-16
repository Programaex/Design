import React from 'react';
export function ArticleHeader({ kicker, title, description, tags = [], meta, className = '', ...rest }) {
  return (
    <header className={['art-head', className].filter(Boolean).join(' ')} {...rest}>
      {kicker && <span className="art-kicker">{kicker}</span>}
      <h1 className="art-title">{title}</h1>
      {description && <p className="art-desc">{description}</p>}
      {(meta || tags.length > 0) && (
        <div className="art-meta">
          {meta && <span>{meta}</span>}
          {tags.map(t => <span key={t} className="tag tag-neutral">{t}</span>)}
        </div>
      )}
    </header>
  );
}
