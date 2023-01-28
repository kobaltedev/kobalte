import { Accessor, createContext, useContext } from "solid-js";

import { ListState } from "../list";

export interface AccordionContextValue {
  listState: Accessor<ListState>;
  generateId: (part: string) => string;
}

export const AccordionContext = createContext<AccordionContextValue>();

export function useAccordionContext() {
  const context = useContext(AccordionContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useAccordionContext` must be used within a `Accordion.Root` component"
    );
  }

  return context;
}
