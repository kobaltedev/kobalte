import { Accessor, createContext, useContext } from "solid-js";

export interface ListBoxOptionDataSet {
  "data-disabled": string | undefined;
  "data-selected": string | undefined;
  "data-hover": string | undefined;
  "data-focus": string | undefined;
  "data-focus-visible": string | undefined;
  "data-active": string | undefined;
}

export interface ListBoxOptionContextValue {
  dataset: Accessor<ListBoxOptionDataSet>;
  isSelected: Accessor<boolean>;
  setLabelRef: (el: HTMLElement) => void;
  generateId: (part: string) => string;
  registerLabel: (id: string) => () => void;
  registerDescription: (id: string) => () => void;
}

export const ListBoxOptionContext = createContext<ListBoxOptionContextValue>();

export function useListBoxOptionContext() {
  const context = useContext(ListBoxOptionContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useListBoxOptionContext` must be used within a `ListBox.Option` component"
    );
  }

  return context;
}
