import { Polygon } from "@kobalte/utils";
import { Accessor, createContext, Setter, useContext } from "solid-js";

import { ListState } from "../list";
import { Placement } from "../popper/utils";
import { CollectionItem } from "../primitives";
import { FocusStrategy } from "../selection";

export interface MenuContextValue {
  isOpen: Accessor<boolean>;
  shouldMount: Accessor<boolean>;
  currentPlacement: Accessor<Placement>;
  isPointerInNestedMenu: Accessor<boolean>;
  isPointerSuspended: Accessor<boolean>;
  autoFocus: Accessor<FocusStrategy | boolean | undefined>;
  listState: Accessor<ListState>;
  parentMenuContext: Accessor<MenuContextValue | undefined>;
  triggerRef: Accessor<HTMLElement | undefined>;
  contentRef: Accessor<HTMLElement | undefined>;
  triggerId: Accessor<string | undefined>;
  contentId: Accessor<string | undefined>;
  setTriggerRef: (el: HTMLElement) => void;
  setContentRef: (el: HTMLDivElement) => void;
  setIsPointerInNestedMenu: Setter<boolean>;
  setIsPointerSuspended: Setter<boolean>;
  setPointerGracePolygon: Setter<Polygon | null>;
  open: (focusStrategy: FocusStrategy | boolean) => void;
  close: () => void;
  clearCloseTimeout: () => void;
  toggle: (focusStrategy: FocusStrategy | boolean) => void;
  focusContent: (key?: string | undefined) => void;
  focusContentWithDelay: (key?: string, delay?: number) => void;
  clearFocusContentTimeout: () => void;
  suspendPointer: () => void;
  isTargetInNestedMenu: (target: Element) => boolean;
  registerNestedMenu: (element: Element) => () => void;
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
