import { Accessor, createContext, useContext } from "solid-js";

import { ListState } from "../list";

export interface ListBoxDataSet {}

export interface ListBoxContextValue {
  dataset: Accessor<ListBoxDataSet>;
  listState: Accessor<ListState>;
  generateId: (part: string) => string;
  shouldUseVirtualFocus: Accessor<boolean | undefined>;
  shouldSelectOnPressUp: Accessor<boolean | undefined>;
  shouldFocusOnHover: Accessor<boolean | undefined>;
  isVirtualized: Accessor<boolean | undefined>;
}

export const ListBoxContext = createContext<ListBoxContextValue>();

export function useListBoxContext() {
  const context = useContext(ListBoxContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useListBoxContext` must be used within a `ListBox` component");
  }

  return context;
}
