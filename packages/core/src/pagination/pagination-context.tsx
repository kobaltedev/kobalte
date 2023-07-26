import { Accessor, createContext, JSX, Setter, useContext } from "solid-js";


export interface PaginationContextValue {
  count: Accessor<number>;
  siblingCount: Accessor<number>;
  showFirst: Accessor<boolean>;
  showLast: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  renderItem: (page: number) => JSX.Element;
  renderEllipsis: (page: number) => JSX.Element;
  page: Accessor<number>;
  setPage: Setter<number>;
  generateItemId: (value: string | number) => string;
}

export const PaginationContext = createContext<PaginationContextValue>();

export function usePaginationContext() {
  const context = useContext(PaginationContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `usePaginationContext` must be used within a `Pagination` component");
  }

  return context;
}
