import React from 'react';
export function AsciiDiagram({ id, kind = 'flowchart', title, children, className = '', ...rest }) {
  const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
  return (
    <figure className={['ascii', className].filter(Boolean).join(' ')} id={id} data-kind={kind} {...rest}>
      <pre className="ascii-body" role="img" aria-label={title || kind}>{text}</pre>
      {(title || id) && <figcaption className="ascii-cap">{title}{id && <code className="ptp-id">{id}</code>}</figcaption>}
    </figure>
  );
}
