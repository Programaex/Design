import * as React from 'react';
/** Centred 28px promo tile — the apple.com home-page tile. */
export interface PromoTileProps extends React.HTMLAttributes<HTMLDivElement> {
  kicker?: React.ReactNode;
  title?: React.ReactNode;
  body?: React.ReactNode;
  /** Buttons row, centred */
  actions?: React.ReactNode;
  /** Image / anatomy render placed below the copy */
  media?: React.ReactNode;
  /** Flip just this tile */
  theme?: 'light' | 'dark';
  children?: React.ReactNode;
}
export declare function PromoTile(props: PromoTileProps): JSX.Element;
