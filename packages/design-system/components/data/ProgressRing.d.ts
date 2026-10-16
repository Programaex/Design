import * as React from 'react';
/** Anel de progresso (0–100) com o valor no centro. Cor de ação; 100% vira sucesso. */
export interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: number;
  stroke?: number;
  /** Nome acessível, ex. "Completude do Blog" */
  label?: string;
}
export declare function ProgressRing(props: ProgressRingProps): JSX.Element;
