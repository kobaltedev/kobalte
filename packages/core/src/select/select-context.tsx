import { Accessor, createContext, Setter, useContext } from "solid-js";

import { ListState } from "../list";
import { CollectionItemWithRef } from "../primitives";
import { FocusStrategy, KeyboardDelegate } from "../selection";

export interface SelectContextValue {
  isOpen: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  isMultiple: Accessor<boolean>;
  autoFocus: Accessor<FocusStrategy | boolean>;
  triggerRef: Accessor<HTMLButtonElement | undefined>;
  triggerId: Accessor<string | undefined>;
  valueId: Accessor<string | undefined>;
  listboxId: Accessor<string | undefined>;
  items: Accessor<CollectionItemWithRef[]>;
  setItems: (items: CollectionItemWithRef[]) => void;
  listboxAriaLabelledBy: Accessor<string | undefined>;
  listState: Accessor<ListState>;
  keyboardDelegate: Accessor<KeyboardDelegate>;
  setListboxAriaLabelledBy: Setter<string | undefined>;
  setTriggerRef: (el: HTMLButtonElement) => void;
  setContentRef: (el: HTMLDivElement) => void;
  setListboxRef: (el: HTMLDivElement) => void;
  open: (focusStrategy: FocusStrategy | boolean) => void;
  close: () => void;
  toggle: (focusStrategy: FocusStrategy | boolean) => void;
  generateId: (part: string) => string;
  registerTriggerId: (id: string) => () => void;
  registerValueId: (id: string) => () => void;
  registerListboxId: (id: string) => () => void;
}

export const SelectContext = createContext<SelectContextValue>();

export function useSelectContext() {
  const context = useContext(SelectContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useSelectContext` must be used within a `Select` component");
  }

  return context;
}
