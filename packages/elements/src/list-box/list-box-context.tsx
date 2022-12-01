import { Accessor, createContext, useContext } from "solid-js";

import { ListBoxSelectionMode } from "./types";

export interface ListBoxDataSet {}

export interface ListBoxContextValue {
  dataset: Accessor<ListBoxDataSet>;
  selectionMode: Accessor<ListBoxSelectionMode>;
  generateId: (part: string) => string;
}

export const ListBoxContext = createContext<ListBoxContextValue>();

export function useListBoxContext() {
  const context = useContext(ListBoxContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useListBoxContext` must be used within a `ListBox` component");
  }

  return context;
}

//

export interface ListBoxOptionDataSet {}

export interface ListBoxOptionContextValue {
  dataset: Accessor<ListBoxOptionDataSet>;
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
