import * as React from 'react';
/** Recessed track with a raised selected thumb. */
export interface SegmentOption { value: string; label: string; icon?: React.ReactNode; }
export interface SegmentedControlProps {
  name: string;
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  ariaLabel?: string;
}
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;
