import * as React from 'react';
/** Painel de texto puro (monoespaçado) para exemplos, procedimentos, fontes e limites. Vem do MDX `<PlainTextPanel>`. */
export interface PlainTextPanelProps extends React.HTMLAttributes<HTMLElement> {
  /** ID estável do painel, ex. EX-A01-001 */
  id?: string;
  kind?: 'example' | 'procedure' | 'evidence' | 'status' | 'instruction' | 'note';
  title?: React.ReactNode;
  /** Texto puro; quebras de linha são preservadas */
  children: string;
}
export declare function PlainTextPanel(props: PlainTextPanelProps): JSX.Element;
