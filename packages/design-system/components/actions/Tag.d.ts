import * as React from 'react';
/** Small pill label. Status tones are for state only. */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'accent' | 'neutral' | 'outline' | 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
export declare function Tag(props: TagProps): JSX.Element;
