import * as React from 'react';
/**
 * The 44px sticky translucent bar with backdrop blur.
 */
export interface NavLink { label: string; href?: string; current?: boolean; id?: string; }
export interface NavBarProps {
  brand?: string;
  /** e.g. assets/logo/brain-mark.png (24px) */
  logoSrc?: string;
  links?: NavLink[];
  /** Usually a <Button size="sm"> */
  action?: React.ReactNode;
  onBrandClick?: () => void;
  onNavigate?: (link: NavLink) => void;
}
export declare function NavBar(props: NavBarProps): JSX.Element;
