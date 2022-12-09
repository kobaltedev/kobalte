import { Accessor, createContext, useContext } from "solid-js";

export interface ListboxOptionDataSet {
  "data-disabled": string | undefined;
  "data-selected": string | undefined;
  "data-hover": string | undefined;
  "data-focus": string | undefined;
  "data-focus-visible": string | undefined;
  "data-active": string | undefined;
}

export interface ListboxOptionContextValue {
  dataset: Accessor<ListboxOptionDataSet>;
  isSelected: Accessor<boolean>;
  generateId: (part: string) => string;
  registerLabel: (id: string) => () => void;
  registerDescription: (id: string) => () => void;
}

export const ListboxOptionContext = createContext<ListboxOptionContextValue>();

export function useListboxOptionContext() {
  const context = useContext(ListboxOptionContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useListboxOptionContext` must be used within a `Listbox.Option` component"
    );
  }

  return context;
}
