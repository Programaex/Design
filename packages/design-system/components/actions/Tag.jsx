import React from 'react';
export function Tag({ tone = 'neutral', icon, className = '', children, ...rest }) {
  return <span className={['tag', 'tag-' + tone, className].filter(Boolean).join(' ')} {...rest}>{icon}{children}</span>;
}
