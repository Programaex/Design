import React from 'react';
const KIND_LABEL = { example: 'Exemplo', procedure: 'Procedimento', evidence: 'Fontes', status: 'Limites', instruction: 'Instruções', note: 'Nota' };
export function PlainTextPanel({ id, kind = 'note', title, children, className = '', ...rest }) {
  const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
  return (
    <figure className={['ptp', 'ptp-' + kind, className].filter(Boolean).join(' ')} id={id} {...rest}>
      <figcaption className="ptp-head"><span className="ptp-kind">{KIND_LABEL[kind] || kind}</span>{title && <span className="ptp-title">{title}</span>}{id && <code className="ptp-id">{id}</code>}</figcaption>
      <pre className="ptp-body">{text}</pre>
    </figure>
  );
}
