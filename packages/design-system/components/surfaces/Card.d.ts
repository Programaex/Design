import * as React from 'react';
/**
 * Flat 18px content tile on --color-surface.
 */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  kicker?: React.ReactNode;
  title?: React.ReactNode;
  body?: React.ReactNode;
  meta?: React.ReactNode;
  elevation?: 'sm' | 'md' | 'lg';
  /** Adds pointer + 1% hover scale */
  interactive?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;
