import * as React from 'react';
/** Cartão de Kanban: ID mestre, contexto (tag) e título. Arrastável quando `draggable`. */
export interface KanbanCardProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  title: React.ReactNode;
  context?: React.ReactNode;
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
  done?: boolean;
  children?: React.ReactNode;
}
export declare function KanbanCard(props: KanbanCardProps): JSX.Element;
