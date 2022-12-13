import { Accessor, createContext, useContext } from "solid-js";

import { ListState } from "../list";
import { FocusStrategy } from "../selection";

export interface MenuContextValue {
  isOpen: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  autoFocus: Accessor<FocusStrategy | boolean>;
  listState: Accessor<ListState>;
  triggerId: Accessor<string | undefined>;
  panelId: Accessor<string | undefined>;
  setTriggerRef: (el: HTMLButtonElement) => void;
  open: (focusStrategy?: FocusStrategy) => void;
  close: () => void;
  toggle: (focusStrategy?: FocusStrategy) => void;
  onAction: (key: string) => void;
  generateId: (part: string) => string;
  registerTrigger: (id: string) => () => void;
  registerPanel: (id: string) => () => void;
}

export const MenuContext = createContext<MenuContextValue>();

export function useOptionalMenuContext() {
  return useContext(MenuContext);
}

export function useMenuContext() {
  const context = useOptionalMenuContext();

  if (context === undefined) {
    throw new Error("[kobalte]: `useMenuContext` must be used within a `Menu` component");
  }

  return context;
}
