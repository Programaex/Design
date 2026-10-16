import * as React from 'react';
/** 28px modal over a blurred scrim. */
export interface DialogProps {
  open?: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Right-aligned button row: secondary then primary */
  actions?: React.ReactNode;
  /** Called on scrim click */
  onClose?: () => void;
  /** Pin backdrop to the nearest positioned parent instead of the viewport */
  contained?: boolean;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
