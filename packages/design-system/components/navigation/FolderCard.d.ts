import * as React from 'react';
/** Pasta da taxonomia (D01–D16): ID, nome canônico, slug e contagem de arquivos. */
export interface FolderCardProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  title: React.ReactNode;
  slug?: string;
  count?: number;
  status?: 'existing' | 'empty' | 'planned';
  interactive?: boolean;
}
export declare function FolderCard(props: FolderCardProps): JSX.Element;
