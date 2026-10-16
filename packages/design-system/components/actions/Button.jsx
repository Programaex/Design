import React from 'react';
export function Button({ variant = 'primary', size = 'md', icon, iconAfter, iconOnly = false, block = false, href, type = 'button', className = '', children, ...rest }) {
  const cls = ['btn', 'btn-' + variant, size === 'sm' && 'btn-sm', iconOnly && 'btn-icon', block && 'btn-block', className].filter(Boolean).join(' ');
  const inner = <>{icon}{!iconOnly && children}{iconAfter}</>;
  if (href) return <a className={cls} href={href} {...rest}>{inner}</a>;
  return <button type={type} className={cls} {...rest}>{inner}</button>;
}
