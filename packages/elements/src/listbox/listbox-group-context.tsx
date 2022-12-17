import { createContext, useContext } from "solid-js";

export interface ListboxGroupContextValue {
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
