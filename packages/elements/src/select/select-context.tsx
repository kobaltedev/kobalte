import { Accessor, createContext, Setter, useContext } from "solid-js";

import { ListState } from "../list";
import { FocusStrategy, KeyboardDelegate } from "../selection";
import { CollectionItem } from "../primitives";

export interface SelectContextValue {
  isOpen: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  isMultiple: Accessor<boolean>;
  autoFocus: Accessor<FocusStrategy | boolean>;
  triggerRef: Accessor<HTMLButtonElement | undefined>;
  triggerId: Accessor<string | undefined>;
  valueId: Accessor<string | undefined>;
  listboxId: Accessor<string | undefined>;
  items: Accessor<CollectionItem[]>;
  setItems: (items: CollectionItem[]) => void;
  menuAriaLabelledBy: Accessor<string | undefined>;
  listState: Accessor<ListState>;
  keyboardDelegate: Accessor<KeyboardDelegate>;
  setMenuAriaLabelledBy: Setter<string | undefined>;
  setTriggerRef: (el: HTMLButtonElement) => void;
  setListboxRef: (el: HTMLDivElement) => void;
  open: (focusStrategy?: FocusStrategy) => void;
  close: (focusStrategy?: FocusStrategy) => void;
  generateId: (part: string) => string;
  registerTrigger: (id: string) => () => void;
  registerValue: (id: string) => () => void;
  registerListbox: (id: string) => () => void;
}

export const SelectContext = createContext<SelectContextValue>();

export function useSelectContext() {
  const context = useContext(SelectContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useSelectContext` must be used within a `Select` component");
  }

  return context;
}
