import React from 'react';
export function Table({ columns = [], rows = [], onRowClick }) {
  return (
    <table className="table">
      <thead><tr>{columns.map(c => <th key={c.key} style={{ textAlign: c.align || 'left' }}>{c.label}</th>)}</tr></thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.id ?? i} onClick={onRowClick ? () => onRowClick(r) : undefined} style={onRowClick ? { cursor: 'pointer' } : undefined}>
            {columns.map(c => <td key={c.key} style={{ textAlign: c.align || 'left', color: c.muted ? 'var(--color-text-muted)' : undefined }}>{c.render ? c.render(r) : r[c.key]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
