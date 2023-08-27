import { Accessor, createContext, useContext } from "solid-js";

import { ListState } from "../list";
import { Placement } from "../popper/utils";
import { CollectionItemWithRef, CreatePresenceResult } from "../primitives";
import { FocusStrategy } from "../selection";
import { GraceIntent, Side } from "./utils";

export interface MenubarDataSet {
  "data-expanded": string | undefined;
  "data-closed": string | undefined;
}

export interface MenubarContextValue {
  dataset: Accessor<MenubarDataSet>;
  isOpen: Accessor<boolean>;
  contentPresence: CreatePresenceResult;
  currentPlacement: Accessor<Placement>;
  pointerGraceTimeoutId: Accessor<number>;
  autoFocus: Accessor<FocusStrategy | boolean | undefined>;
  listState: Accessor<ListState>;
  parentMenuContext: Accessor<MenubarContextValue | undefined>;
  triggerRef: Accessor<HTMLElement | undefined>;
  contentRef: Accessor<HTMLElement | undefined>;
  triggerId: Accessor<string | undefined>;
  contentId: Accessor<string | undefined>;
  setTriggerRef: (el: HTMLElement) => void;
  setContentRef: (el: HTMLDivElement) => void;
  open: (focusStrategy: FocusStrategy | boolean) => void;
  close: (recursively?: boolean) => void;
  toggle: (focusStrategy: FocusStrategy | boolean) => void;
  focusContent: () => void;
  onItemEnter: (e: PointerEvent) => void;
  onItemLeave: (e: PointerEvent) => void;
  onTriggerLeave: (e: PointerEvent) => void;
  setPointerDir: (dir: Side) => void;
  setPointerGraceTimeoutId: (id: number) => void;
  setPointerGraceIntent: (intent: GraceIntent | null) => void;
  registerTriggerId: (id: string) => () => void;
  registerContentId: (id: string) => () => void;
}

export const MenuContext = createContext<MenubarContextValue>();

export function useOptionalMenubarContext() {
  return useContext(MenuContext);
}

export function useMenubarContext() {
  const context = useOptionalMenubarContext();

  if (context === undefined) {
    throw new Error("[kobalte]: `useMenubarContext` must be used within a `Menubar` component");
  }

  return context;
}
