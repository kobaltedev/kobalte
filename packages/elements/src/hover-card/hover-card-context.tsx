import { Accessor, createContext, useContext } from "solid-js";

export interface HoverCardContextValue {
  isOpen: Accessor<boolean>;
  closeOnEsc: Accessor<boolean | undefined>;
  closeOnHoverOutside: Accessor<boolean | undefined>;
  openTimeoutId: Accessor<number | undefined>;
  closeTimeoutId: Accessor<number | undefined>;
  openWithDelay: () => void;
  closeWithDelay: () => void;
  close: () => void;
  clearOpenTimeout: () => void;
  clearCloseTimeout: () => void;
  triggerRef: Accessor<HTMLElement | undefined>;
  nestedHoverCardRefs: Accessor<HTMLElement[]>;
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
