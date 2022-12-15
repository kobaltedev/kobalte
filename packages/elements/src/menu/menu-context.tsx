import { Accessor, createContext, useContext } from "solid-js";

import { ListState } from "../list";
import { FocusStrategy } from "../selection";
import { MenuItemModel } from "./types";

export interface MenuContextValue {
  isOpen: Accessor<boolean>;
  isModal: Accessor<boolean>;
  preventScroll: Accessor<boolean>;
  trapFocus: Accessor<boolean>;
  autoFocus: Accessor<FocusStrategy | boolean | undefined>;
  listState: Accessor<ListState>;
  parentMenuContext: Accessor<MenuContextValue | undefined>;
  triggerId: Accessor<string | undefined>;
  panelId: Accessor<string | undefined>;
  setTriggerRef: (el: HTMLElement) => void;
  setPanelRef: (el: HTMLDivElement) => void;
  open: (focusStrategy?: FocusStrategy) => void;
  close: (deep?: boolean) => void;
  toggle: (focusStrategy?: FocusStrategy) => void;
  focusPanel: () => void;
  onAction: (key: string) => void;
  registerItemToParentDomCollection: ((item: MenuItemModel) => () => void) | undefined;
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
