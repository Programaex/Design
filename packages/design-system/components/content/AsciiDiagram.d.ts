import * as React from 'react';
/** Diagrama em texto (fluxogramas ASCII) com legenda. Vem do MDX `<AsciiDiagram>`. */
export interface AsciiDiagramProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  kind?: 'flowchart' | 'tree' | 'timeline' | 'matrix';
  title?: React.ReactNode;
  children: string;
}
export declare function AsciiDiagram(props: AsciiDiagramProps): JSX.Element;
