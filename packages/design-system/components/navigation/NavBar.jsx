import React from 'react';
export function NavBar({ brand = 'Risco Cognitivo', logoSrc, links = [], action, onBrandClick, onNavigate }) {
  return (
    <nav className="nav">
      <span className="nav-brand" onClick={onBrandClick}>{logoSrc && <img src={logoSrc} alt="" />}{brand}</span>
      {links.map(l => (
        <a key={l.label} href={l.href || '#'} aria-current={l.current ? 'page' : undefined} onClick={e => { if (onNavigate) { e.preventDefault(); onNavigate(l); } }}>{l.label}</a>
      ))}
      {action}
    </nav>
  );
}
