import { Accessor, createContext, useContext } from "solid-js";

import { ListState } from "../list";
import { FocusStrategy, KeyboardDelegate } from "../selection";

export interface SelectContextValue {
  isOpen: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  isSingleSelectMode: Accessor<boolean>;
  autoFocus: Accessor<FocusStrategy | boolean>;
  triggerRef: Accessor<HTMLButtonElement | undefined>;
  triggerId: Accessor<string | undefined>;
  valueId: Accessor<string | undefined>;
  listboxId: Accessor<string | undefined>;
  menuAriaLabelledBy: Accessor<string | undefined>;
  listState: Accessor<ListState>;
  keyboardDelegate: Accessor<KeyboardDelegate>;
  setMenuAriaLabelledBy: (value: string | undefined) => void;
  setTriggerRef: (el: HTMLButtonElement) => void;
  toggle: (focusStrategy?: FocusStrategy) => void;
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
