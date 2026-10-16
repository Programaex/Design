import * as React from 'react';
/** Cartão de rota com QR Code, caminho, URL completa, selo de acesso e ações (Abrir, Copiar URL). */
export interface RouteCardProps extends React.HTMLAttributes<HTMLElement> {
  group?: React.ReactNode;
  title: React.ReactNode;
  path: string;
  url?: string;
  access?: 'publico' | 'autenticado' | 'administrador';
  /** Elemento do QR (img/svg) */
  qr?: React.ReactNode;
  note?: React.ReactNode;
  actions?: React.ReactNode;
}
export declare function RouteCard(props: RouteCardProps): JSX.Element;
