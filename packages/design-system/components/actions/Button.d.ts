import * as React from 'react';
/**
 * Pill action. Blue fill = the ONE primary action per view.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = blue fill; secondary = outlined link-blue; ghost = text link */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** sm is for the 44px nav bar */
  size?: 'md' | 'sm';
  /** Leading icon node, e.g. <i className="ph ph-brain" /> */
  icon?: React.ReactNode;
  /** Trailing icon node — ghost buttons take a caret-right */
  iconAfter?: React.ReactNode;
  /** 40×40 round icon button; pass aria-label */
  iconOnly?: boolean;
  block?: boolean;
  /** Renders an <a> instead of <button> */
  href?: string;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
