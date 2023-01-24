import { Accessor, createContext, useContext } from "solid-js";

export interface CollapsibleContextValue {
  isOpen: Accessor<boolean>;
  shouldMount: Accessor<boolean>;
  contentId: Accessor<string | undefined>;
  toggle: () => void;
  generateId: (part: string) => string;
  registerContentId: (id: string) => () => void;
}

export const CollapsibleContext = createContext<CollapsibleContextValue>();

export function useCollapsibleContext() {
  const context = useContext(CollapsibleContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useCollapsibleContext` must be used within a `Collapsible.Root` component"
    );
  }

  return context;
}
