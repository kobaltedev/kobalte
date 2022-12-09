import { Accessor, createContext, useContext } from "solid-js";
import { CollectionNode } from "../primitives";

export interface ListboxGroupContextValue {
  labelId: Accessor<string | undefined>;
  childNodes: Accessor<Iterable<CollectionNode>>;
  generateId: (part: string) => string;
  registerLabel: (id: string) => () => void;
}

export const ListboxGroupContext = createContext<ListboxGroupContextValue>();

export function useListboxGroupContext() {
  const context = useContext(ListboxGroupContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useListboxGroupContext` must be used within a `Listbox.Group` component"
    );
  }

  return context;
}
