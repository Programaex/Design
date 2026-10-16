import * as React from 'react';
/** Cabeçalho de artigo: kicker, título, linha fina, meta e tags. */
export interface ArticleHeaderProps extends React.HTMLAttributes<HTMLElement> {
  kicker?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  tags?: string[];
  meta?: React.ReactNode;
}
export declare function ArticleHeader(props: ArticleHeaderProps): JSX.Element;
