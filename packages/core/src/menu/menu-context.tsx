import { Accessor, createContext, useContext } from "solid-js";

import { ListState } from "../list";
import { CollectionItem } from "../primitives";
import { FocusStrategy } from "../selection";

export interface MenuContextValue {
  isOpen: Accessor<boolean>;
  isModal: Accessor<boolean>;
  shouldMount: Accessor<boolean>;
  autoFocus: Accessor<FocusStrategy | boolean | undefined>;
  listState: Accessor<ListState>;
  parentMenuContext: Accessor<MenuContextValue | undefined>;
  triggerRef: Accessor<HTMLElement | undefined>;
  contentRef: Accessor<HTMLElement | undefined>;
  triggerId: Accessor<string | undefined>;
  contentId: Accessor<string | undefined>;
  setTriggerRef: (el: HTMLElement) => void;
  setContentRef: (el: HTMLDivElement) => void;
  open: (focusStrategy?: FocusStrategy) => void;
  close: (deep?: boolean) => void;
  toggle: (focusStrategy?: FocusStrategy) => void;
  focusContent: () => void;
  onAction: (key: string) => void;
  registerItemToParentDomCollection: ((item: CollectionItem) => () => void) | undefined;
  generateId: (part: string) => string;
  registerTriggerId: (id: string) => () => void;
  registerContentId: (id: string) => () => void;
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
