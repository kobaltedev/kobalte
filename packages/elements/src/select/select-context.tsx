import { Accessor, createContext, JSX, useContext } from "solid-js";

import { ListState } from "../list";
import { FocusStrategy } from "../selection";

export interface SelectDataSet {}

export interface SelectContextValue {
  isOpen: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  autoFocus: Accessor<FocusStrategy | boolean>;
  triggerId: Accessor<string | undefined>;
  listboxId: Accessor<string | undefined>;
  listState: Accessor<ListState>;
  toggle: (focusStrategy?: FocusStrategy) => void;
  generateId: (part: string) => string;
  onTriggerKeyDown: JSX.EventHandlerUnion<HTMLButtonElement, KeyboardEvent>;
  onTriggerFocus: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent>;
  onTriggerBlur: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent>;
  onListboxFocusOut: () => void;
  registerTrigger: (id: string) => () => void;
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
