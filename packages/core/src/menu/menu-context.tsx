import { Accessor, createContext, useContext } from "solid-js";

import { ListState } from "../list";
import { CollectionItem } from "../primitives";
import { FocusStrategy } from "../selection";

export interface MenuContextValue {
  isOpen: Accessor<boolean>;
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
  open: (focusStrategy: FocusStrategy | undefined) => void;
  close: () => void;
  toggle: (focusStrategy: FocusStrategy | undefined) => void;
  focusContent: () => void;
  registerItemToParentDomCollection: ((item: CollectionItem) => () => void) | undefined;
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
