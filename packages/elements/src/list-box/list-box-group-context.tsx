import { Accessor, createContext, useContext } from "solid-js";

export interface ListBoxGroupContextValue {
  labelId: Accessor<string | undefined>;
  generateId: (part: string) => string;
  registerLabel: (id: string) => () => void;
}

export const ListBoxGroupContext = createContext<ListBoxGroupContextValue>();

export function useListBoxGroupContext() {
  const context = useContext(ListBoxGroupContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useListBoxGroupContext` must be used within a `ListBox.Group` component"
    );
  }

  return context;
}
