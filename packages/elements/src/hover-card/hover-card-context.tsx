import { Accessor, createContext, useContext } from "solid-js";

export interface HoverCardContextValue {
  isOpen: Accessor<boolean>;
  openWithDelay: () => void;
  closeWithDelay: () => void;
  cancelOpening: () => void;
  cancelClosing: () => void;
  deepClose: () => void;
  isTargetOnHoverCard: (target: Node | undefined) => boolean;
  registerNestedHoverCard: (element: HTMLElement) => () => void;
  setTriggerRef: (el: HTMLElement) => void;
  setPanelRef: (el: HTMLElement) => void;
}

export const HoverCardContext = createContext<HoverCardContextValue>();

export function useOptionalHoverCardContext() {
  return useContext(HoverCardContext);
}

export function useHoverCardContext() {
  const context = useOptionalHoverCardContext();

  if (context === undefined) {
    throw new Error("[kobalte]: `useHoverCardContext` must be used within a `HoverCard` component");
  }

  return context;
}
