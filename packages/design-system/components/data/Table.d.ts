import * as React from 'react';
/** Hairline-row data table with a quiet 12px header. */
export interface TableColumn { key: string; label: string; align?: 'left' | 'right' | 'center'; muted?: boolean; render?: (row: any) => React.ReactNode; }
export interface TableProps {
  columns: TableColumn[];
  rows: Record<string, any>[];
  onRowClick?: (row: any) => void;
}
export declare function Table(props: TableProps): JSX.Element;
