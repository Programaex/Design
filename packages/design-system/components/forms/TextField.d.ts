import * as React from 'react';
/** 44px field with its label above. */
export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Renders a resizable textarea (min 96px) */
  multiline?: boolean;
  rows?: number;
}
export declare function TextField(props: TextFieldProps): JSX.Element;
